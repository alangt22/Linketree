import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firebaseConnection";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Social } from "../../components/social";
import fotoPadrao from "/semfoto.jpg"; // Substitua pelo caminho da sua imagem padrão

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
  name: string;
  image: string;
}

export function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();

  const [user, setUser] = useState<UserProps | null>(null);
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps | null>(null);

  // Carregar perfil
  useEffect(() => {
    if (!userId) return;

    async function loadProfile() {
      const docRef = doc(db, "users", userId?? "", "info", "profile");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setUser({
          name: snapshot.data().name ?? "Sem nome",
          image: snapshot.data().image ?? "",
        });
      }
    }

    loadProfile();
  }, [userId]);

  // Carregar links
  useEffect(() => {
    if (!userId) return;

    async function loadLinks() {
      const linksRef = collection(db, "links");
      const q = query(
        linksRef,
        where("userId", "==", userId),
        orderBy("created", "asc")
      );
      const snapshot = await getDocs(q);

      const lista: LinkProps[] = [];
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
    }

    loadLinks();
  }, [userId]);

  // Carregar redes sociais
  useEffect(() => {
    if (!userId) return;

    async function loadSocial() {
      const docRef = doc(db, "users", userId?? "", "social", "link");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setSocialLinks({
          facebook: snapshot.data().facebook ?? "",
          instagram: snapshot.data().instagram ?? "",
          youtube: snapshot.data().youtube ?? "",
        });
      }
    }

    loadSocial();
  }, [userId]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mt-10 border-2 border-white">
        <img
          src={user?.image || fotoPadrao}
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-white text-3xl font-bold mt-4">
        {user?.name || "Usuário"}
      </h1>

      <span className="text-gray-300 mt-2 mb-4">Meus links 👇</span>

      <main className="w-11/12 max-w-xl flex flex-col items-center">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 my-2 rounded-md text-center font-medium transition-transform hover:scale-105"
            style={{ backgroundColor: link.bg, color: link.color }}
          >
            {link.name}
          </a>
        ))}

        {socialLinks && (
          <div className="flex gap-4 mt-6">
            {socialLinks.facebook && (
              <Social url={socialLinks.facebook}>
                <FaFacebook size={30} color="#fff" className="transition-transform duration-300 hover:rotate-[15deg]"/>
              </Social>
            )}
            {socialLinks.instagram && (
              <Social url={socialLinks.instagram}>
                <FaInstagram size={30} color="#fff" className="transition-transform duration-300 hover:rotate-[15deg]"/>
              </Social>
            )}
            {socialLinks.youtube && (
              <Social url={socialLinks.youtube}>
                <FaYoutube size={30} color="#fff" className="transition-transform duration-300 hover:rotate-[15deg]"/>
              </Social>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
