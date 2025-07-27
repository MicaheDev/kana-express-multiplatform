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
    <>
      <div className="bg-background dark:bg-dark-background h-[20px]"></div>

      <nav className={`h-[70px] bg-background dark:bg-dark-background  border-b border-characters w-full flex justify-between items-center px-3 ${className}`}>
        {isPrevActive && <button onClick={() => navigate(-1)}>
          <LucideArrowLeft className="text-characters dark:text-dark-characters" />
        </button>}
        {children && children}
      </nav></>
  )
}
