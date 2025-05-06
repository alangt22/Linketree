import { ChangeEvent, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { auth } from "../../services/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection"; // Adicione sua instância do Firestore aqui

interface ImagemPerfilProps {
  uid: string;
  img: string;
}

export function ImagemPerfil({ uid, img }: ImagemPerfilProps) {
  const [image, setImage] = useState(img); // Inicia com a imagem do perfil
  const [loading, setLoading] = useState(false);

  // Função para converter a imagem para base64
  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // UseEffect para carregar a imagem do Firestore ao iniciar
  useEffect(() => {
    const loadImage = async () => {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const userRef = doc(db, "users", uid, "info", "profile");
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData.image) {
          setImage(userData.image);
        }
      }
    };

    loadImage();
  }, [uid]);

  async function handlechange(e: ChangeEvent<HTMLInputElement>) {
    const uid = auth.currentUser?.uid;

    if (!uid) return;

    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const imageFile = e.target.files[0];

      if (imageFile.type !== "image/jpeg" && imageFile.type !== "image/png") {
        alert("Formato não suportado");
        setLoading(false);
        return;
      }

      try {
        const base64Image = await toBase64(imageFile);

        const userRef = doc(db, "users", uid, "info", "profile");
        await setDoc(userRef, { image: base64Image }, { merge: true });

        setImage(base64Image);
        alert("Imagem enviada com sucesso!");
      } catch (error) {
        console.error("Erro ao converter ou salvar a imagem", error);
        alert("Erro ao enviar a imagem");
      }
      setLoading(false);
    }
  }

  return (
    <div className="relative w-40 h-40 rounded-full overflow-hidden group mt-10">
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-100 transition-opacity hover:scale-110">
        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          onChange={handlechange}
        />
        {loading ? (
          <FaSpinner size={30} className="animate-spin" />
        ) : (
          <FaCloudUploadAlt className="text-white text-4xl z-50 pointer-events-none" />
        )}
      </div>

      {image ? (
        <img
          id={uid}
          src={image}
          alt="Imagem de perfil"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <FaCloudUploadAlt size={30} />
        </div>
      )}
    </div>
  );
}
