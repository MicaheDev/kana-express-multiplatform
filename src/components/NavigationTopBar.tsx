import { LucideArrowLeft } from "lucide-react"
import { ReactNode } from "react"
import { useNavigate } from "react-router";

type NavigationTopBarProps = {
  children?: ReactNode,
  isPrevActive: boolean,
  className?: string
}

export default function NavigationTopBar({ children, isPrevActive, className }: NavigationTopBarProps) {
  const navigate = useNavigate();

  return (

      <header className={`h-[70px] shrink-0 w-full flex px-6 text-characters dark:text-dark-characters border-b border-characters dark:border-dark-characters ${className}`}>
        {isPrevActive && <button onClick={() => navigate(-1)}>
          <LucideArrowLeft className="text-characters dark:text-dark-characters w-8 h-8" />
        </button>}
        {children && children}
      </header>
  )
}
