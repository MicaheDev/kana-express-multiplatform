import { useEffect, useState } from "react";
import BottomSheet from "../components/BottomSheet";
import SignUp from "../forms/SignUp";
import Login from "../forms/Login";
import { BottomSheetProvider } from "../context/BottomSheetContext";
import { Link, useNavigate } from "react-router";
import LogoTopBar from "../components/LogoTopBar";
import Scaffold from "../components/Scaffold";
import Button from "../components/Button";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para mostrar mensajes de error

  const navigate = useNavigate();

  useEffect(() => {
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

    if (users.length < 1) {
      setError("There is not any user register, please create account");
      return;
    }

    let session: { email: string; username: string } | null = null;
    const sessionData = localStorage.getItem("session");

    if (sessionData) {
      try {
        session = JSON.parse(sessionData);
      } catch (error) {
        console.error("Error parsing session from localStorage:", error);
        session = null;
      }
    }

    if (!session) {
      setError("There is not user register, please login");
      return;
    }

    const userExist = users.find((user) => user.email === session.email);

    if (!userExist) {
      setError("This user not exist");
      return;
    }

    navigate("/learn");

    console.log(error);
  });

  return (
    <>
      <Scaffold topBar={<LogoTopBar />} contentClassName="justify-between">
        <>
          <div className="flex justify-center flex-col items-center gap-2">
            <figure className="h-auto w-auto relative overflow-hidden">
              <img
                className="rounded-4xl aspect-video object-cover object-top"
                src="/hero.jpg"
                alt=""
              />
              <div className="absolute bg-gradient-to-b from-primary/10 to-background inset-0 dark:to-dark-background"></div>
            </figure>

            <h1 className="text-center text-3xl uppercase font-black">
              Aprende Japones De Forma Rapida y Sencilla
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setIsLogin(false);
                setIsRegister(true);
              }}
            >
              Registrarme
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsRegister(false);
                setIsLogin(true);
              }}
            >
              Iniciar Sesion
            </Button>
            <Link className="text-center" to={"/learn"}>
              Omitir
            </Link>
          </div>
        </>
      </Scaffold>

      <BottomSheet
        isVisible={isRegister}
        setIsVisible={setIsRegister}
        showClose
      >
        <BottomSheetProvider setIsVisible={setIsRegister}>
          <SignUp />
        </BottomSheetProvider>
      </BottomSheet>

      <BottomSheet isVisible={isLogin} setIsVisible={setIsLogin} showClose>
        <BottomSheetProvider setIsVisible={setIsLogin}>
          <Login />
        </BottomSheetProvider>
      </BottomSheet>
    </>
  );
}
