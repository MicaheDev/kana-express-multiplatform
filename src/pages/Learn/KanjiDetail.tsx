import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import Board, { type BoardRef } from '../../components/Board'
import { useEffect, useRef, useState, type ReactElement } from 'react'
import { data, useNavigate, useParams } from 'react-router';
import { courses, type Course } from '../../data/kanji';
import { MdCheck, MdInfoOutline, MdOutlineArrowBack, MdOutlineArrowForward, MdOutlineTaskAlt } from 'react-icons/md';
import type { Progress } from './LearnDetail';

export default function KanjiDetail() {
  const navigate = useNavigate();
  const { module: courseModule } = useParams<{ module: string }>();

  const [currentModule, setCurrentModule] = useState<Course>(courses[0])
  const [exampleGif, setExampleGif] = useState<string>('')
  const [currentCell, setCurrentCell] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const boardRef = useRef<BoardRef | null>(null)

  const [isStart, setIsStart] = useState(false)

  const [progress, setProgress] = useState<Progress | null>(null)

  const [showGif, setShowGif] = useState(true)



  useEffect(() => {
    // Inicializar Modulo

    if (!courseModule) {
      navigate("/learn/kanji")
      return;
    }

    const availableCourse = courses.find((course) => {
      return course.id === parseInt(courseModule)
    })

    console.log(availableCourse)

    if (!availableCourse) {
      navigate("/learn/kanji")
      return;
    }


    setCurrentModule(availableCourse)

    if (availableCourse.data.length > 0) {
      setExampleGif(`/gifs/kanji/${courseModule}/${availableCourse.data[0].gif}`);
    } else {
      setExampleGif(''); // O una imagen de "no disponible"
    }
    setIsLoading(false)
  }, [courseModule, navigate])

  // Actualizar recursos ejem: Gif's
  useEffect(() => {
    if (!isLoading && currentModule && currentModule.data.length > 0) {
      updateResources()
    }
  }, [currentCell, currentModule, courseModule, isLoading]) // ADD currentModule and isLoading here!



  function handleNext() {
    if (currentCell >= (currentModule.data.length - 1)) {
      setCurrentCell(0)
      return;
    }

    setCurrentCell(prev => prev + 1) // Usa el callback para asegurar el valor más reciente
  }

  function handlePrev() {
    if (currentCell == 0) {
      setCurrentCell(currentModule.data.length - 1)
      return;
    }
    setCurrentCell(prev => prev - 1) // Usa el callback para asegurar el valor más reciente
  }

  function updateResources() {
    clearCanvas()
    if (currentModule && currentModule.data && currentModule.data[currentCell]) {
      setExampleGif(`/gifs/kanji/${courseModule}/${currentModule.data[currentCell].gif}`)
    }
  }

  function handleCellClicked(cell: number) {
    setCurrentCell(cell)
    clearCanvas()
    updateResources()
  }


  function verifyKanji() {
    const currentKanji = currentModule.data[currentCell]

    if (currentKanji.strokes === boardRef.current?.strokesLength) {
      currentModule.data[currentCell].todo = true

      setCurrentModule(currentModule)

    } else {
      alert(`Inténtalo de nuevo. El número de trazos esperado es ${currentKanji.strokes}, y has realizado ${boardRef.current?.strokesLength}.`);
      return;
    }

    handleNext()
  }


  function verifyProgress() {
    let total = currentModule.data.length
    let doIt = 0

    currentModule.data.forEach((quiz) => {
      if (quiz.todo) {
        doIt++
      }
    })

    const calc = (doIt / total) * 100

    const result = Math.round(calc)
    console.log(`${result}%`)

    if (doIt <= 0 && result <= 0) {
      setProgress(null)
    } else {
      setProgress({ total, doIt, progress: result })

    }

    setIsStart(false)

    resetAll()
  }

  function resetAll() {
    clearCanvas()
    resetProgress()
    setCurrentCell(0)

  }

  function resetProgress() {
    let kanjiList = [...currentModule.data]

    kanjiList.forEach((quiz) => {
      quiz.todo = false
    })


    const newKanjiModule = { ...currentModule }

    newKanjiModule.data = kanjiList

    setCurrentModule(newKanjiModule)
  }

  function clearCanvas() {
    boardRef.current?.clearCanvas();
  }

  return (
    <>

      {isLoading ? <div className='flex justify-center items-center py-8'>
        <span className='font-jpn text-4xl'>ちょっと待ってください
        </span>
      </div> :

        <div className='py-8 w-full flex justify-center items-start gap-4'>
          <div className="flex flex-col gap-2">

            <div className="w-auto h-min outline outline-gray-700 grid grid-cols-5 auto-rows-auto overflow-hidden rounded-xl select-none">
              {currentModule.data.map((item, index) => (
                <CharacterCell isTodo={item.todo} index={index} onCellClicked={handleCellClicked} key={item.label} isSelected={currentCell === index}>{item.label}</CharacterCell>
              ))}

            </div>

              <button onClick={verifyProgress} className="bg-pink-400 outline justify-center outline-gray-700">
                <span>Finalizar sesión</span><MdOutlineTaskAlt className="text-xl" />
              </button>
          </div>

          <div className="flex flex-col gap-2">

            <Board ref={boardRef}>
              <>
                <div className="flex flex-col gap-2 items-end justify-center absolute bottom-0 right-0 m-2 z-10">
                  <button onClick={() => setShowGif(!showGif)} className="bg-white w-[60px] h-[60px] text-2xl outline outline-gray-700 justify-center">
                    {showGif ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>

                </div>

                <div className="outline outline-gray-700 px-4 py-2 rounded-md bg-gray-700 text-white flex  max-w-[600px] gap-2 items-center justify-center absolute bottom-0 left-0 m-2 z-10">
                  <p className='text-sm'>{currentModule.data[currentCell].explanation}</p>

                  <MdInfoOutline />
                </div>



                {exampleGif && (
                  <img
                    className={`w-full h-full object-contain absolute inset-0 m-auto pointer-events-none transition-opacity duration-300 ${showGif ? "opacity-20" : "opacity-0"}`}
                    src={exampleGif}
                    width="10px"
                    height="10px"
                    alt="GIF animado del trazo del kanji"
                  />
                )}
              </>
            </Board>



            <div className="flex items-center gap-2 justify-between">
              <button onClick={handlePrev} className="bg-white outline outline-gray-700 text-gray-700">
                <MdOutlineArrowBack /> <span>Volver</span>
              </button>
              <div className="flex gap-2 items-center">
                <button onClick={handleNext} className="bg-white outline outline-gray-700 text-gray-700">
                  <span>Saltar</span><MdOutlineArrowForward />
                </button>
                <button onClick={verifyKanji} className="bg-green-200 text-gray-700 outline outline-gray-700">
                  <span>Verificar</span><MdCheck />
                </button>
              </div>
            </div>
          </div>
        </div>}
    </>
  )
}


type CharacterCellProps = {
  index: number
  isSelected: boolean,
  isTodo: boolean,
  children: ReactElement | string | number,
  onCellClicked: (cell: number) => void

}

function CharacterCell({ children, isSelected, isTodo, onCellClicked, index }: CharacterCellProps) {
  return (
    <div
      onClick={() => onCellClicked(index)}
      className={`w-[50px] h-[50px] font-jpn border border-neutral-300 flex justify-center items-center ${isSelected && 'bg-pink-400'} ${isTodo && 'bg-green-200'} `}>

      {children}
    </div>
  )
}