import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/input";

import { auth, db } from "../../services/firebaseConnection";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

export function Networks() {
  const [loading, setLoading] = useState(false);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  function handleRegister(e: FormEvent) {
    setLoading(true);
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setDoc(doc(db, "users", uid, "social", "link"), {
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
    })
      .then(() => {
        toast.success("Redes sociais cadastradas com sucesso!");
        setLoading(false);
      })
      .catch((error) => {
        console.log("deu erro", error);
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "social", "link");
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            const data = snapshot.data();
            setFacebook(data.facebook ?? "");
            setInstagram(data.instagram ?? "");
            setYoutube(data.youtube ?? "");
          } else {
            console.log("Nenhuma rede social cadastrada ainda.");
          }
        } catch (error) {
          console.log("Erro ao buscar redes sociais:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />
      <h1 className="text-white text-2xl font-medium mt-8 mb-4">
        Minhas Redes Sociais
      </h1>

      <form onSubmit={handleRegister} className="flex flex-col max-w-xl w-full">
        <label className="text-white font-medium mt-2 mb-2">
          Link do facebook
        </label>
        <Input
          type="url"
          placeholder="Digite a url do facebook..."
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">
          Link do instagram
        </label>
        <Input
          type="url"
          placeholder="Digite a url do instagram..."
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">
          Link do youtube
        </label>
        <Input
          type="url"
          placeholder="Digite a url do youtube..."
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />
        {loading ? (
          <div className="h-9 bg-blue-600 rounded justify-center items-center flex border-0 text-lg font-medium text-white">
            <FaSpinner className="animate-spin" />
          </div>
        ) : (
          <button
            type="submit"
            className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium"
          >
            Salvar links
          </button>
        )}
      </form>
    </div>
  );
}
