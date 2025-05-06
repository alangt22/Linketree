import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Social } from "../../components/social";
import { auth, db } from "../../services/firebaseConnection";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import fotoPerfil from "/semfoto.jpg";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  color: string;
  bg: string;
}

interface SocialLinksProps {
  facebook: string;
  instagram: string;
  youtube: string;
}

interface UserProps {
  id: string;
  name: string;
  image: string;
}

export function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();
  const [user, setUser] = useState<UserProps>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const linksRef = collection(db, "links");
        const queryRef = query(
          linksRef,
          where("userId", "==", user.uid),
          orderBy("created", "asc")
        );

        getDocs(queryRef)
          .then((snapshot) => {
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
          })
          .catch((error) => {
            console.error("Erro ao buscar links:", error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "social", "link");
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            setSocialLinks({
              facebook: snapshot.data().facebook ?? "",
              instagram: snapshot.data().instagram ?? "",
              youtube: snapshot.data().youtube ?? "",
            });
          } else {
            console.log("Documento de redes sociais não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao carregar redes sociais:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "info", "profile");
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            setUser({
              id: user.uid,
              name: snapshot.data().name ?? "",
              image: snapshot.data()?.image ?? "", // Adicionando a imagem aqui
            });
          } else {
            console.log("Documento de informações do usuário não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao carregar informações do usuário:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mt-10 border-2 border-white">
        <img
          src={user?.image || fotoPerfil}
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">
        {user?.name || "visitante"}
      </h1>

      {auth.currentUser?.uid && (
        <Link
          to="/admin"
          className="fixed top-4 right-4 bg-green-500/50 hover:bg-green-500 py-1 px-4 rounded-md z-50"
        >
          Perfil
        </Link>
      )}

      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg, color: link.color }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
          >
            <a
              href={link.url}
              target="_blank"
              className="flex flex-col items-center"
            >
              <p className="text-base md:text-lg">{link.name}</p>
            </a>
          </section>
        ))}

        {socialLinks && (
          <footer className="flex justify-center gap-3 my-4">
            {socialLinks.facebook && (
              <Social url={socialLinks?.facebook}>
                <FaFacebook
                  size={35}
                  color="#fff"
                  className="transition-transform duration-300 hover:rotate-[15deg]"
                />
              </Social>
            )}
            {socialLinks.youtube && (
              <Social url={socialLinks?.youtube}>
                <FaYoutube
                  size={35}
                  color="#fff"
                  className="transition-transform duration-300 hover:rotate-[15deg]"
                />
              </Social>
            )}
            {socialLinks.instagram && (
              <Social url={socialLinks?.instagram}>
                <FaInstagram
                  size={35}
                  color="#fff"
                  className="transition-transform duration-300 hover:rotate-[15deg]"
                />
              </Social>
            )}
          </footer>
        )}
      </main>
    </div>
  );
}
