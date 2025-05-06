import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/input";
import { FiTrash } from "react-icons/fi";
import { auth, db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
  setDoc,
} from "firebase/firestore";
import { ImagemPerfil } from "../../components/imagemPerfil";
import { Link } from "react-router-dom";
import fotoPerfil from "/semfoto.jpg";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  color: string;
  bg: string;
}

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColorInput, setTextColorInput] = useState("#f1f1f1");
  const [backgroundColorInput, setBackgroundColorInput] = useState("#121212");
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;

    if (!uid) return;

    const linksRef = collection(db, "links");
    const queryRef = query(
      linksRef,
      where("userId", "==", uid),
      orderBy("created", "asc")
    );

    const unsub = onSnapshot(queryRef, (snapshot) => {
      let lista = [] as LinkProps[];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          color: doc.data().color,
          bg: doc.data().bg,
        });
      });
      setLinks(lista);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (nameInput === "" || urlInput === "") {
      toast.warn("Preencha os campos");
      setLoading(false);
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("Usuário não autenticado.");
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      color: textColorInput,
      bg: backgroundColorInput,
      created: new Date(),
      userId: auth.currentUser?.uid,
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        setTextColorInput("#f1f1f1");
        setBackgroundColorInput("#121212");
        setLoading(false);
        toast.success("Link cadastrado com sucesso!");
      })
      .catch((error) => {
        console.log("deu erro", error);
      });
  }
  async function registerName() {
    if (user.trim() === "") {
      toast.warn("Preencha o campo");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("Usuário não autenticado.");
      return;
    }
    try {
      await setDoc(
        doc(db, "users", uid, "info", "profile"),
        { name: user.trim() },
        { merge: true }
      );
      console.log("Nome do usuário salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o nome do usuário:", error);
    }
    toast.success("Nome do usuário salvo com sucesso!");
    setUser("");
  }

  async function handleDeleteLink(id: string) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
    toast.success("Link excluido com sucesso!");
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />
      <h1 className="text-white font-bold text-2xl mb-10 mt-5">
        Dados pessoais
      </h1>
      <button>
        <Link
          to={`/u/${auth.currentUser?.uid}`}
          target="_blank"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 mt-1 px-4 rounded"
        >
          Link pubilco
        </Link>
      </button>
      <div className="flex flex-col justify-center items-center">
        <ImagemPerfil uid="image" img={fotoPerfil} />
        <label className="text-white font-medium mt-2 mb-2">Seu Nome</label>
        <Input
          type="text"
          placeholder="Digite o nome do usuário..."
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <button
        onClick={registerName}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3"
      >
        Salvar
      </button>

      <form
        className="flex flex-col mt-8 mb-3 w-full max-w-xl"
        onSubmit={handleRegister}
      >
        <label className="text-white font-medium mt-2 mb-2">Nome do link</label>
        <Input
          placeholder="Digite o nome do link..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <Input
          type="url"
          placeholder="URL do link..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex my-4 gap-5">
          <div className="flex gap-2">
            <label className="text-white font-medium mt-2 mb-2">
              Cor do link
            </label>
            <input
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <label className="text-white font-medium mt-2 mb-2">
              Fundo do link
            </label>
            <input
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && (
          <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium mt-2 mb-2">
              Veja como ficaria
            </label>
            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-2"
              style={{
                marginBottom: 8,
                marginTop: 8,
                backgroundColor: backgroundColorInput,
              }}
            >
              <p className="font-medium" style={{ color: textColorInput }}>
                {nameInput}
              </p>
            </article>
          </div>
        )}

        {loading ? (
          <div className="h-9 bg-blue-600 rounded justify-center items-center flex border-0 text-lg font-medium text-white">
            <FaSpinner className="animate-spin" />
          </div>
        ) : (
          <button
            type="submit"
            className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center"
          >
            Cadastrar
          </button>
        )}
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">Links cadastrados</h2>
      {links.map((link) => (
        <article
          key={link.id}
          className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
          style={{ backgroundColor: link.bg, color: link.color }}
        >
          <p>{link.name}</p>
          <div>
            <button
              className="border border-dashed p-1 rounded bg-neutral-900"
              onClick={() => handleDeleteLink(link.id)}
            >
              <FiTrash size={18} color="#fff" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
