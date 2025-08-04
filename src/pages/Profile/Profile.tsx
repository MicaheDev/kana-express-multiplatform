import { useEffect, useState } from "react";
import NavigationBottomBar from "../../components/NavigationBottomBar";
import NavigationTopBar from "../../components/NavigationTopBar";
import Scaffold from "../../components/Scaffold";
import Button from "../../components/Button";
import { useNavigate } from "react-router";

export default function Profile() {

    const [credentials, setCredentials] = useState<{ email: string, username: string } | null>(null)
    const [error, setError] = useState<string | null>(null); // Para mostrar mensajes de error
    const navigate = useNavigate()

    useEffect(() => {
        let session: { email: string, username: string } | null = null
        const sessionData = localStorage.getItem("session")

        if (sessionData) {
            try {
                session = JSON.parse(sessionData)
            } catch (error) {
                console.error("Error parsing session from localStorage:", error);
                session = null
            }
        }

        if (!session) {
            setError("There is not user register, please login")
            return
        }

        setCredentials(session)

        console.log(error)

    }, [])


    function logout() {

        localStorage.removeItem("session")

        setCredentials(null)

        navigate("/")
    }
    return (
        <Scaffold topBar={<NavigationTopBar isPrevActive />} bottomBar={<NavigationBottomBar />}>

            <div className="w-full h-full flex justify-center flex-col gap-8">

                <h1 className="text-4xl text-center uppercase w-full">Tu cuenta</h1>
                <div className="flex-col flex gap-2">
                    <p>
                        Username: {credentials?.username}
                    </p>

                    <p>Email: {credentials?.email}</p>

                </div>
                {
                    credentials && <Button onClick={logout}>
                        Cerrar Sesion
                    </Button>
                }

                {!credentials && "Not account"}
            </div>

        </Scaffold>
    )
}
