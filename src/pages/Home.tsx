import { useState } from 'react'
import BottomSheet from '../components/BottomSheet'
import SignUp from '../forms/SignUp'
import Login from '../forms/Login'
import { BottomSheetProvider } from '../context/BottomSheetContext'
import { Link } from 'react-router'
import LogoTopBar from '../components/LogoTopBar'
import Scaffold from '../components/Scaffold'
import Button from '../components/Button'

export default function Home() {
  const [isLogin, setIsLogin] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  return (
    <>


      <Scaffold topBar={<LogoTopBar />} contentClassName='justify-between'>
        <>

          <div className='flex justify-center flex-col items-center gap-2'>
            <figure className='h-auto w-auto relative overflow-hidden'>
              <img className='rounded-4xl aspect-video object-cover object-top' src="/hero.jpg" alt="" />
              <div className='absolute bg-gradient-to-b from-primary/10 to-background inset-0 dark:to-dark-background'></div>
            </figure>

            <h1 className='text-center text-3xl uppercase font-black'>Aprende Japones De Forma Rapida y Sencilla</h1>

          </div>

          <div className='flex flex-col gap-4'>
  
            <Button onClick={() => { setIsLogin(false); setIsRegister(true) }}>
              Registrarme
            </Button>
            <Button variant='secondary' onClick={() => { setIsRegister(false); setIsLogin(true) }}>
              Iniciar Sesion
            </Button>
            <Link className='text-center' to={"/learn"}>Omitir</Link>
          </div>
        </>
      </Scaffold>

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
