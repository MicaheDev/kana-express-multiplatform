import { ReactNode } from "react"
import { useNavigate } from "react-router";


export default function LogoTopBar() {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-primary dark:bg-dark-primary h-[20px]"></div>

            <nav className={`h-[70px] border-b bg-primary dark:bg-dark-primary border-characters w-full flex justify-between items-center px-3 `}>
                <div className='w-full h-full flex justify-center gap-2 items-center'>
                    <img className='w-[40px] h-[40px]' src="/vite.svg" alt="logo" />
                    <h1 className='text-2xl'>Kana Express</h1>

                </div>
            </nav></>
    )
}
