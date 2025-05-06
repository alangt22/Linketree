import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { FormEvent, useState } from "react";

import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FaSpinner } from "react-icons/fa";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    setLoading(true);
    e.preventDefault();
    if (email === "" || password === "") {
      alert("Preencha os campos");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("logado com sucesso");
        navigate("/admin", { replace: true });
        setLoading(false);
      })
      .catch((error) => {
        console.log("erro de login");
        console.log(error);
      });
  }

  return (
    <div className="flex w-full h-screen items-center justify-center flex-col">
      <Link to="/">
        <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
          Dev
          <span className=" bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Link
          </span>
        </h1>
      </Link>
      <h1 className="font-bold text-3xl mb-4 text-white">Cadastre-se</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col px-3"
      >
        <Input
          placeholder="Digite seu e-mail..."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="*********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loading ? (
          <div className="h-9 bg-blue-600 rounded justify-center items-center flex border-0 text-lg font-medium text-white">
            <FaSpinner className="animate-spin" />
          </div>
        ) : (
          <button
            type="submit"
            className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white"
          >
            Criar conta
          </button>
        )}
        <Link to="/" className="text-white mt-3 hover:underline">
          Ja possui uma conta?
        </Link>
      </form>
    </div>
  );
}
