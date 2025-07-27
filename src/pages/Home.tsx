import { useState } from 'react'
import BottomSheet from '../components/BottomSheet'
import SignUp from '../forms/SignUp'
import Login from '../forms/Login'
import { BottomSheetProvider } from '../context/BottomSheetContext'
import { Link } from 'react-router'
import LogoTopBar from '../components/LogoTopBar'

export default function Home() {
  const [isLogin, setIsLogin] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  return (
    <>
      <section className='flex flex-col h-full'>
        <LogoTopBar />
        <div className='p-6 flex flex-col h-full justify-between'>

          <div className='flex justify-center flex-col items-center gap-2'>
            <figure className='h-auto w-auto relative overflow-hidden'>
              <img className='rounded-4xl aspect-video object-cover object-top' src="/hero.jpg" alt="" />
              <div className='absolute bg-gradient-to-b from-primary/10 to-background inset-0 dark:to-dark-background'></div>
            </figure>

            <h1 className='text-center text-3xl uppercase font-black'>Aprende Japones De Forma Rapida y Sencilla</h1>

          </div>

          <div className='flex flex-col gap-4'>
            <div className='bg-characters dark:bg-dark-characters w-full rounded-xl'>
              <button className='bg-primary dark:bg-dark-primary w-full h-full p-4 rounded-xl border border-characters dark:border-dark-characters -translate-y-2 hover:translate-y-0 active:translate-y-0 transition-transform duration-150' onClick={() => { setIsLogin(false); setIsRegister(true) }}>Registrarme</button>

            </div>
            <div className='bg-characters dark:bg-dark-characters w-full rounded-xl'>
              <button className='bg-background dark:bg-dark-background w-full h-full p-4 rounded-xl border border-characters dark:border-dark-characters -translate-y-2 hover:translate-y-0 active:translate-y-0 transition-transform duration-150' 
              onClick={() => { setIsRegister(false); setIsLogin(true) }}>Iniciar Sesión</button>
            </div>
            <Link className='text-center' to={"/learn"}>Omitir</Link>
          </div>

        </div>
      </section>

      <BottomSheet isVisible={isRegister} setIsVisible={setIsRegister} >
        <BottomSheetProvider setIsVisible={setIsRegister}>
          <SignUp />
        </BottomSheetProvider>
      </BottomSheet>


      <BottomSheet isVisible={isLogin} setIsVisible={setIsLogin} >
        <BottomSheetProvider setIsVisible={setIsLogin}>
          <Login />
        </BottomSheetProvider>
      </BottomSheet>
    </>
  )
}
