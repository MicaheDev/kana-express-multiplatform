import { Link, useNavigate } from "react-router";
import { useBottomSheet } from "../context/BottomSheetContext";
import { FormEvent, useState } from "react";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  const { setIsVisible } = useBottomSheet()
  function handleCloseLogin() { setIsVisible(false) };

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null); // Para mostrar mensajes de error

  const navigate = useNavigate();

  function onLogin(e: FormEvent) {
    e.preventDefault()
    setError(null); // Limpiar errores previos

    // 1. Validar que todos los campos estén llenos
    if (!email || !password) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    let users: User[] = [];
    const data = localStorage.getItem("users");

    if (data) {
      try {
        users = JSON.parse(data);
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        // Si el JSON es corrupto, inicializa un array vacío
        users = [];
      }
    }

    if(users.length < 1)
    {
      setError("There is not any user register, please create account")
      return
    }

    const userExist = users.find((user) => user.email === email)

    if(!userExist){
      setError("This user not exist")
      return
    }

    if(userExist.password !== password){
      setError("Password Incorrect")
      return
    }

    const userSession = {
      username: userExist.username,
      email: userExist.email,
    }

    localStorage.setItem("session", JSON.stringify(userSession))

    navigate("/learn")
    handleCloseLogin()



  }
  return (
    <form onSubmit={(e) => onLogin(e)} className="flex flex-col gap-4">
      {error &&
        <p className="text-center">{error}</p>
      }
      <h2 className="text-center">Ingresar</h2>

      <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters" type="text" placeholder="Correo Electronico" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters" type="text" placeholder="Contraseña" />

      <Link className="text-center text-lg underline hover:text-characters dark:hover:text-dark-characters" to={""}>Olvide mi contraseña</Link>

      <button className="btn-primary" type="submit" >Ingresar</button>

      <p className="text-sm text-center">
        Esta página está protegida por reCAPTCHA Enterprise. Aplican tanto la política de privacidad como los términos del servicio de Google.
      </p>
    </form>
  )
}
