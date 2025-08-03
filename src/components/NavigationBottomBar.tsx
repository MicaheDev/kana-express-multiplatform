
import { Dumbbell, GraduationCap, UserPen } from "lucide-react";
import { useNavigate } from "react-router";

type NavigationBarProps = {

  className?: string
}

export default function NavigationBottomBar({ className }: NavigationBarProps) {
  const navigate = useNavigate();

  return (

    <nav className={`h-[100px] bg-background dark:bg-dark-background  border-t border-characters w-full flex justify-center gap-6 items-center px-3 ${className}`}>


      <div className='bg-characters dark:bg-dark-characters rounded-xl'>
        <button className='bg-primary dark:bg-dark-primary w-full h-full py-3 px-6 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150' onClick={() => { navigate("/learn")}}>
          <GraduationCap className="w-7 h-7" />
        </button>


      </div>

      <div className='bg-characters dark:bg-dark-characters rounded-xl'>
        <button className='bg-background dark:bg-dark-background w-full h-full py-3 px-6  border border-transparent dark:border-dark-transparent hover:translate-y-0 active:translate-y-0 transition-transform duration-150' onClick={() => { navigate("/practice") }}>
          <Dumbbell className="w-7 h-7"/>
        </button>

      </div>

      <div className='bg-characters dark:bg-dark-characters rounded-xl'>
        <button className='bg-background dark:bg-dark-background w-full h-full py-3 px-6  border border-transparent dark:border-dark-transparent hover:translate-y-0 active:translate-y-0 transition-transform duration-150' onClick={() => {navigate("/profile") }}>
          <UserPen className="w-7 h-7" />
        </button>

      </div>


    </nav>
  )
}
