import { useCallback, useEffect, useRef, useState } from "react";
import { hiragana, katakana, type Kana } from "../../data/kana";
import { useParams } from "react-router";
import type { BoardRef } from "../../components/Board";
import Board from "../../components/Board";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import KanaGrid from "./components/KanaGrid";
import { LuVolume2 } from "react-icons/lu";
import { removeExtensionName } from "../../utils";
import NavigationBottomBar from "../../components/NavigationBottomBar";
import NavigationTopBar from "../../components/NavigationTopBar";
import BottomSheet from "../../components/BottomSheet";
import Scaffold from "../../components/Scaffold";
import Button from "../../components/Button";
import StartView from "./components/StartView";

export type Progress = {
    total: number, doIt: number, progress: number
}

export default function LearnDetail() {
    const { kana: kanaType } = useParams<{ kana: string }>();

    const [showBoard, setShowBoard] = useState(false)
    const [showProgress, setShowProgress] = useState(false)

    // Seleccionar el array basado en el parámetro
    const [kana, setKana] = useState(kanaType === 'hiragana' ? [...hiragana] : [...katakana]);

   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [gif, setGif] = useState<string | undefined>(undefined); // Initialize with undefined or a default


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


    const [progress, setProgress] = useState<Progress | null>(null)

  // This effect ensures media sources are updated when selectedKana changes.
    // It should *set* the audio object, not play it yet.
    useEffect(() => {
        const currentKana = kana[selectedRow]?.[selectedCol];
        if (typeof currentKana === 'object' && currentKana.sound) {
            setAudio(new Audio(`/sounds/${currentKana.sound}`));
            setGif(currentKana.gif);
        } else {
            setAudio(null);
            setGif(undefined);
        }
    }, [selectedCol, selectedRow, kana]); // Added kana to dependency array for completeness

 
   const playSound = () => {
        if (audio) {
            audio.play().catch(error => console.error("Error playing audio:", error));
        }
    }

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
            setShowBoard(true)

            // Play sound explicitly ONLY when a Kana is clicked
            // Use a small timeout to ensure the audio state has updated after setSelectedRow/Col
            // This is a common pattern to ensure state updates have propagated.
            setTimeout(() => {
                const currentKana = kana[row]?.[col];
                if (typeof currentKana === 'object' && currentKana.sound) {
                    new Audio(`/sounds/${currentKana.sound}`).play().catch(error => console.error("Error playing audio on click:", error));
                }
            }, 50); // Small delay, adjust if needed
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

    /**
     * 
     * function handlePrev() {
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
     */

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
            return
        } else {
            setProgress({ total, doIt, progress: result })
            setShowProgress(true)

        }



        resetAll()
    }

    function restart() {
        changeMediaSources(); setProgress(null); setShowProgress(false)
    }

    return (
        <>


            <Scaffold topBar={<NavigationTopBar isPrevActive />} bottomBar={<NavigationBottomBar />}>
                <>
                    <h2 className="text-lg text-center">Complete la Tabla de Caracteres</h2>
                    <KanaGrid kana={kana} selectedCol={selectedCol} selectedRow={selectedRow} navigateToKana={navigateToKana} />

                    <Button onClick={() => { verifyProgress() }}>
                        Finalizar
                    </Button>
                </>
            </Scaffold>

            <BottomSheet isVisible={showProgress} setIsVisible={setShowProgress}>
                <StartView progress={progress} kanaType={kanaType} restart={restart} />
            </BottomSheet>


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
                                    <button onClick={() => audio?.play()} className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'>
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

                    <Button onClick={() => verifyKana()}>
                        Verificar
                    </Button>
                </div>

            </BottomSheet>
        </>



    );
}


