import { Dumbbell, GraduationCap, House, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

type NavigationBarProps = {
  className?: string;
};

export default function NavigationBottomBar({ className }: NavigationBarProps) {
  const [credentials, setCredentials] = useState<{
    email: string;
    username: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null); // Para mostrar mensajes de error

  useEffect(() => {
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

    setCredentials(session);

    console.log(error);
  }, []);
  return (
    <nav
      className={`h-[100px] bg-background dark:bg-dark-background  border-t border-characters w-full flex justify-center gap-6 items-center px-3 ${className}`}
    >
      <NavLink
        to="/"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
            : "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
        }
      >
        {({ isActive }) => (
          <span
            className={
              isActive ? "btn-s-primary px-6!" : "btn-s-secondary px-6!"
            }
          >
            <House className="w-6 h-6" />
          </span>
        )}
      </NavLink>

      <NavLink
        to="/learn"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
            : "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
        }
      >
        {({ isActive }) => (
          <span
            className={
              isActive ? "btn-s-primary px-6!" : "btn-s-secondary px-6!"
            }
          >
            <GraduationCap className="w-6 h-6" />
          </span>
        )}
      </NavLink>

      <NavLink
        to="/practice"
        className={({ isActive, isPending }) =>
          isPending
            ? "pending"
            : isActive
            ? "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
            : "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
        }
      >
        {({ isActive }) => (
          <span
            className={
              isActive ? "btn-s-primary px-6!" : "btn-s-secondary px-6!"
            }
          >
            <Dumbbell className="w-6 h-6" />
          </span>
        )}
      </NavLink>

      {/* 
  
      {credentials && <NavLink
        to="/profile"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "bg-characters flex dark:bg-dark-characters rounded-xl w-auto" : "bg-characters flex dark:bg-dark-characters rounded-xl w-auto"
        }

      >
        {({ isActive }) => (
          <span className={isActive ? "btn--sprimary px-6!" : "btn-s-secondary px-6!"}>
            <UserPen className="w-6 h-6" />
          </span>
        )}
      </NavLink>}
  */}
    </nav>
  );
}
