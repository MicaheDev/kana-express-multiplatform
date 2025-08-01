import { useCallback, useEffect, useRef, useState } from "react";
import { MdCheck, MdOutlineArrowBack, MdOutlineArrowForward, MdOutlineTaskAlt } from "react-icons/md";
import { hiragana, katakana, type Kana } from "../../data/kana";
import { useParams } from "react-router";
import type { BoardRef } from "../../components/Board";
import Board from "../../components/Board";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import StartView from "./components/StartView";
import KanaGrid from "./components/KanaGrid";
import { LuVolume2 } from "react-icons/lu";
import { removeExtensionName } from "../../utils";
import NavigationBottomBar from "../../components/NavigationBottomBar";
import NavigationTopBar from "../../components/NavigationTopBar";
import BottomSheet from "../../components/BottomSheet";

export type Progress = {
    total: number, doIt: number, progress: number
}

export default function LearnDetail() {
    const { kana: kanaType } = useParams<{ kana: string }>();

    const [showBoard, setShowBoard] = useState(false)

    // Seleccionar el array basado en el parámetro
    const [kana, setKana] = useState(kanaType === 'hiragana' ? [...hiragana] : [...katakana]);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(new Audio(`/sounds/${(kana[1][1] as Kana).sound}`)); // Inicializa con el primer sonido
    const [gif, setGif] = useState((kana[1][1] as Kana).gif);

    const gifCache = useRef<Record<string, HTMLImageElement>>({});


    // Precargar GIFs
    useEffect(() => {
        const allKana = kanaType === 'hiragana' ? hiragana : katakana;
        const gifFiles = allKana
            .flat()
            .filter((item): item is Kana => typeof item === 'object' && !!item.gif)
            .map(item => ({
                path: `/gifs/${kanaType}/${item.gif}`,
                name: item.gif
            }));

        // Precargar GIFs en caché
        gifFiles.forEach(({ path, name }) => {
            if (!gifCache.current[name]) {
                const img = new Image();
                img.src = path;
                gifCache.current[name] = img;
            }
        });
    }, [kanaType]);


    const boardRef = useRef<BoardRef | null>(null)
    const [showGif, setShowGif] = useState(true)


    const [selectedRow, setSelectedRow] = useState(1);
    const [selectedCol, setSelectedCol] = useState(1);

    const [isStart, setIsStart] = useState(false)

    const [progress, setProgress] = useState<Progress | null>(null)


    useEffect(() => {
        changeMediaSources()
    }, [selectedCol, selectedRow])


    // Nuevo efecto para reproducir el audio cuando cambia
    useEffect(() => {
        if (!audio) return;

        if (audio.src == null || audio.src.length < 1) return;
        if (!isStart) return;

        audio.play()

        // Limpieza del audio anterior
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, [audio]);


    const verifyKana = () => {
        const currentKana = kana[selectedRow]?.[selectedCol];

        if (typeof currentKana === 'object' && currentKana !== null) {
            if (currentKana.strokes === boardRef.current?.strokesLength) {
                // Crear una copia del array para no mutar el estado directamente
                const updatedKana = kana.map((row, rowIndex) =>
                    rowIndex === selectedRow
                        ? row.map((item, colIndex) =>
                            colIndex === selectedCol && typeof item === 'object' && item !== null
                                ? { ...item, todo: true }
                                : item
                        )
                        : row
                );
                setKana(updatedKana);
                setShowBoard(false)
            } else {
                alert(`Inténtalo de nuevo. El número de trazos esperado es ${currentKana.strokes}, y has realizado ${boardRef.current?.strokesLength}.`);
                return;
            }
        }

        handleNext()

    };

    function navigateToKana(row: number, col: number) {
        if (typeof kana[row][col] === "object") {
            setSelectedRow(row)
            setSelectedCol(col)
            clearCanvas();
            changeMediaSources();
            setShowBoard(true)
        }

    }

    function handleNext() {
        let nextRow = selectedRow;
        let nextCol = selectedCol;
        if (!boardRef.current) return;
        boardRef.current.strokesLength = 0; // Resetear el contador de trazos al cambiar de carácter

        while (true) {
            if (nextRow >= (kana.length - 1) && nextCol >= (kana[kana.length - 1].length - 1)) {
                setSelectedRow(1);
                setSelectedCol(1);
                clearCanvas();
                changeMediaSources();
                return;
            }

            if (nextCol >= (kana[nextRow].length - 1)) {
                nextRow++;
                nextCol = 1;
            } else {
                nextCol++;
            }

            // Verificar si la celda actual contiene un objeto Kana con sonido
            const currentItem = kana[nextRow]?.[nextCol];
            if (currentItem && typeof currentItem === 'object' && (currentItem as Kana).sound) {
                setSelectedRow(nextRow);
                setSelectedCol(nextCol);
                clearCanvas();
                changeMediaSources();
                return;
            }

            // Evitar bucles infinitos
            if (nextRow >= kana.length) {
                setSelectedRow(1);
                setSelectedCol(1);
                clearCanvas();
                changeMediaSources();
                return;
            }
        }
    }

    function handlePrev() {
        let prevRow = selectedRow;
        let prevCol = selectedCol;
        if (!boardRef.current) return;
        boardRef.current.strokesLength = 0; // Resetear el contador de trazos al cambiar de carácter


        while (true) {
            if (prevRow <= 1 && prevCol <= 1) {
                setSelectedRow(kana.length - 1);
                setSelectedCol(kana[kana.length - 1].length - 1);
                clearCanvas();
                changeMediaSources();
                return;
            }

            if (prevCol <= 1) {
                prevRow--;
                prevCol = kana[prevRow].length - 1;
            } else {
                prevCol--;
            }

            // Verificar si la celda actual contiene un objeto Kana con sonido
            const currentItem = kana[prevRow]?.[prevCol];
            if (currentItem && typeof currentItem === 'object' && (currentItem as Kana).sound) {
                setSelectedRow(prevRow);
                setSelectedCol(prevCol);
                clearCanvas();
                changeMediaSources();
                return;
            }

            // Evitar bucles infinitos
            if (prevRow <= 0) {
                setSelectedRow(kana.length - 1);
                setSelectedCol(kana[kana.length - 1].length - 1);
                clearCanvas();
                changeMediaSources();
                return;
            }
        }
    }

    const changeMediaSources = useCallback(() => {
        if ((kana[selectedRow][selectedCol] as Kana).sound == null || (kana[selectedRow][selectedCol] as Kana).sound.length < 1) return;
        setAudio(new Audio(`/sounds/${(kana[selectedRow][selectedCol] as Kana).sound}`))
        setGif((kana[selectedRow][selectedCol] as Kana).gif)
    }, [kana, selectedRow, selectedCol])

    function clearCanvas() {
        boardRef.current?.clearCanvas()
    }

    function resetAll() {
        clearCanvas()
        resetProgress()

        setSelectedRow(1)
        setSelectedCol(1)
    }


    function resetProgress() {
        let kanaList = [...kana]

        kanaList.forEach((_, row) => {
            return kanaList[row].forEach((quiz, _) => {
                if (typeof quiz === 'object') {
                    quiz.todo = false
                }
            })
        })

        setKana(kanaList)
    }

    function verifyProgress() {
        let total = 0
        let doIt = 0

        kana.forEach((_, row) => {
            kana[row].forEach((quiz, _) => {
                if (typeof quiz === 'object') {
                    total++

                    if (quiz.todo) {
                        doIt++
                    }
                }
            })
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

    function restart() {
        setIsStart(true); changeMediaSources(); setProgress(null)
    }

    return (
        <>
            <div className="overflow-hidden w-screen h-screen flex flex-col">
                <NavigationTopBar isPrevActive />
                <div className="grow h-full overflow-y-auto p-6 flex gap-4 flex-col ">

                    <h2 className="text-lg text-center">Complete la Tabla de Caracteres</h2>
                    <KanaGrid kana={kana} selectedCol={selectedCol} selectedRow={selectedRow} navigateToKana={navigateToKana} />
                    <div className='bg-characters dark:bg-dark-characters w-full rounded-xl'>
                        <button className='bg-primary dark:bg-dark-primary w-full h-full p-4 rounded-xl border border-characters dark:border-dark-characters -translate-y-2 hover:translate-y-0 active:translate-y-0 transition-transform duration-150' onClick={() => { }}>Finalizar</button>

                    </div>
                </div>

                <NavigationBottomBar />
            </div>


            <BottomSheet isVisible={showBoard} setIsVisible={setShowBoard}>
                <div className="flex flex-col h-full w-full gap-4">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="bg-gray-700 text-white w-auto inline-flex justify-center items-center rounded-md h-[40px] px-4 outline outline-gray-700">

                            Fonética: "{removeExtensionName((kana[selectedRow][selectedCol] as Kana).sound)}"
                        </span>
              

                    </div>
                    <Board ref={boardRef}>
                        <>
                            <div className="flex gap-2 items-end justify-center absolute top-4 inset-x-0 w-min mx-auto z-10">
                                <div className='bg-characters dark:bg-dark-characters  rounded-xl'>
                                    <button onClick={() => setShowGif(!showGif)}
                                        className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'>

                                        {showGif ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </button>
                                </div>


                                <div className='bg-characters dark:bg-dark-characters  rounded-xl'>
                                    <button onClick={() => audio?.play()}    className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'>
                                        <LuVolume2 />
                                    </button>
                                </div>

                            </div>



                            {gif && (
                                <img
                                    className={`w-full mix-blend-multiply pt-[70px] h-full object-contain absolute inset-0 m-auto pointer-events-none transition-opacity duration-300 ${showGif ? "opacity-30" : "opacity-0"} `}
                                    src={`/gifs/${kanaType === 'hiragana' ? 'hiragana' : 'katakana'}/${gif}`}
                                    width="10px"
                                    height="10px"
                                    alt="GIF animado del trazo del kanji"
                                />
                            )}
                        </>
                    </Board>

                    <div className='bg-characters dark:bg-dark-characters w-full rounded-xl'>
                        <button className='bg-primary dark:bg-dark-primary w-full h-full p-4 rounded-xl border border-characters dark:border-dark-characters -translate-y-2 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'
                            onClick={() => { verifyKana()}}>Verificar</button>
                    </div>
                </div>

            </BottomSheet>
        </>



    );
}


/*
         <div className="flex justify-center items-center w-full min-h-[80svh] h-full">
    <div className="w-full flex justify-center gap-4">
               <div className="flex flex-col gap-2">
 
                   <KanaGrid kana={kana} selectedCol={selectedCol} selectedRow={selectedRow} navigateToKana={navigateToKana}/>
 
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
 
                               <button onClick={() => audio?.play()} className="bg-white w-[60px] h-[60px] text-2xl outline outline-gray-700 justify-center">
                                   <LuVolume2/>
                               </button>
                           </div>
 
                             <div className="flex flex-col gap-2 items-end justify-center absolute bottom-0 left-0 m-2 z-10">
                               <span className="bg-gray-700 text-white w-auto inline-flex justify-center items-center rounded-md h-[40px] px-4 outline outline-gray-700">
 
                                   Fonética: "{removeExtensionName((kana[selectedRow][selectedCol] as Kana).sound)}"
                               </span>
 
                           </div>
 
                           {gif && (
                               <img
                                   className={`w-full h-full object-contain absolute inset-0 m-auto pointer-events-none transition-opacity duration-300 ${showGif ? "opacity-20" : "opacity-0"} `}
                                   src={`/gifs/${kanaType === 'hiragana' ? 'hiragana' : 'katakana'}/${gif}`}
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
                           <button onClick={verifyKana} className="bg-green-200 text-gray-700 outline outline-gray-700">
                               <span>Verificar</span><MdCheck />
                           </button>
                       </div>
                   </div>
 
               </div>
           </div>
       </div>
       */