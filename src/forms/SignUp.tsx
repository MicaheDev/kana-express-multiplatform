import { FormEvent, useState } from "react"
import { useBottomSheet } from "../context/BottomSheetContext"

interface User {
    username: string;
    email: string;
    password: string;
}

export default function SignUp() {
    const { setIsVisible } = useBottomSheet()
    function handleCloseRegister() {
        setIsVisible(false)
        setError(null); // Limpia cualquier error al cerrar

    };

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [error, setError] = useState<string | null>(null); // Para mostrar mensajes de error

    function onLogin(e: FormEvent) {
        e.preventDefault()
        setError(null); // Limpiar errores previos

        // 1. Validar que todos los campos estén llenos
        if (!username || !email || !password || !confirmedPassword) {
            setError("Por favor, rellena todos los campos.");
            return;
        }

        // 2. Validar que las contraseñas coincidan
        if (password !== confirmedPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // Puedes añadir validaciones de longitud de contraseña, formato de email, etc.
        // Ejemplo: if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
        // Ejemplo: if (!/\S+@\S+\.\S+/.test(email)) { setError("Formato de correo electrónico inválido."); return; }

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

        // 3. Validar email único
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            setError("Este correo electrónico ya está registrado.");
            return;
        }

        const newUser: User = {
            username,
            email,
            password // En una aplicación real, NUNCA guardarías la contraseña sin hashear
            // confirmedPassword no es necesario guardar si ya validaste que coincide
        };

        users = [...users, newUser];
        localStorage.setItem("users", JSON.stringify(users));

        handleCloseRegister();

    }

    return (
            <form onSubmit={e => onLogin(e)} className="flex flex-col gap-4">
                {error &&
                    <p className="text-center">{error}</p>
                }


                <h2 className="text-center">Crear una cuenta</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters"
                    type="text"
                    placeholder="Nombre de usuario" />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters"
                    type="email"
                    placeholder="Correo Electronico" />

                <input
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters"
                    type="password" placeholder="Contraseña" />

                <input
                    value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}
                    className="p-4 w-full border rounded-xl border-characters dark:border-dark-characters"
                    type="password"
                    placeholder="Confirmar Contraseña" />

                <button type="submit" className="btn-primary">Finalizar Registro</button>
                <p className="text-sm text-center">
                    Al registrarte en Kana Express, aceptas nuestros Términos y Política de privacidad.

                </p>

            </form>
    )
}
