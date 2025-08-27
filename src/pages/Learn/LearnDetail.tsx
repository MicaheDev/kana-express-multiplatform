import { useCallback, useEffect, useRef, useState } from "react";
import {
  hiragana,
  hiraganaCombinations,
  hiraganaDakuten,
  katakana,
  katakanaCombinations,
  katakanaDakuten,
  type Kana,
} from "../../data/kana";
import { useParams, useSearchParams } from "react-router";
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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export type Progress = {
  total: number;
  doIt: number;
  progress: number;
};

export default function LearnDetail() {
  const driverObj1 = driver({
    showProgress: true,
    smoothScroll: true, // Habilita el scroll suave para una mejor experiencia
    onCloseClick: () => {
      const tutorial = true;
      localStorage.setItem("learn2", JSON.stringify(tutorial));
      driverObj1.destroy();
    },
    steps: [
      {
        element: "#grid",
        popover: {
          title: "La tabla de caracteres",
          description:
            "Esta es la tabla completa de caracteres del silabario. Funciona como una tabla de coordenadas para multiplicar: las **guías horizontales (vocales)** y las **guías verticales (consonantes)** se combinan para formar cada carácter en la cuadrícula.",
          side: "over",
          align: "center",
        },
      },
      {
        element: "#row-3 > div:nth-child(1)",
        popover: {
          title: "Guía de consonantes",
          description:
            "Aquí se encuentran todas las consonantes. Por ejemplo, en esta posición está la **consonante 'k'**.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#row-1 > div:nth-child(4)",
        popover: {
          title: "Guía de vocales",
          description:
            "En esta fila se ubican las vocales. Aquí se encuentra la **vocal 'u'**.",
          side: "bottom", // Cambiado a 'bottom' para que no tape la vocal
          align: "center",
        },
      },
      {
        element: "#row-3 > div:nth-child(4)",
        popover: {
          title: "El carácter く (ku)",
          description:
            "Cuando combinas la consonante **'k'** con la vocal **'u'**, obtienes el carácter く (ku) en esta coordenada de la tabla.",
          side: "top",
          align: "center",
        },
      },

      {
        element: "#row-2 > div:nth-child(2)",

        popover: {
          title: "Comienza a practicar!",
          description:
            "Cuando estés listo, haz clic en este botón para iniciar la sesión de aprendizaje del silabario seleccionado.",
          side: "top",
          align: "center",
          onNextClick: () => {
            const button: HTMLButtonElement | null =
              document.querySelector("#selected");
            if (button) {
              // Simula el click después de un pequeño delay para que Driver termine sus animaciones
              setTimeout(() => {
                button.click();

                // Si necesitas verificar que se hizo click
                console.log("Botón clickeado");
              }, 300);

              setTimeout(() => {
                driverObj1.moveNext();
              }, 600);
            } else {
              console.warn("No se encontró el botón #selected");
            }
          },
        },
      },

      {
        element: "#board",
        popover: {
          title: "¡Es hora de escribir!",
          description:
            "Este es el **lienzo de escritura**. Aquí verás una guía que te muestra **trazo por trazo** cómo escribir el carácter correctamente. El **orden de los trazos es muy importante** y te ayudará a memorizarlo de forma efectiva.",
          side: "over",
          align: "center",
        },
      },

      {
        element: "#show-guide-to-draw",
        popover: {
          title: "Muestra la guía de trazos",
          description:
            "Usa este botón para activar y desactivar la guía que te muestra **trazo por trazo** cómo escribir el carácter. Si quieres un reto mayor, puedes desactivarla y escribir a mano alzada.",
          side: "top",
          align: "center",
        },
      },

      {
        element: "#sound",
        popover: {
          title: "Escucha el sonido",
          description:
            "Haz clic en este botón para reproducir el sonido del carácter actual. Puedes escucharlo tantas veces como necesites para familiarizarte con su pronunciación.",
          side: "top",
          align: "center",
        },
      },

      {
        element: "#verify",
        popover: {
          onNextClick: () => {
            const tutorial = true;
            localStorage.setItem("learn2", JSON.stringify(tutorial));

            driverObj1.destroy();
          },
          title: "Verifica tu trazo",
          description:
            "Una vez que hayas intentado escribir el carácter, haz clic aquí para verificar tu trabajo. La app comparará tu trazo con el correcto y te dirá si lo lograste o si necesitas practicar más.",
          side: "top",
          align: "center",
        },
      },
    ],
  });

  const { kana: kanaType } = useParams<{ kana: string }>();
  const [searchParams] = useSearchParams();

  const variation = searchParams.get("variation");

  const [showBoard, setShowBoard] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Seleccionar el array basado en el parámetro
  const [kana, setKana] = useState(() => {
    switch (variation) {
      case "main":
        return kanaType === "hiragana" ? hiragana : katakana;
      case "dakuten":
        return kanaType === "hiragana" ? hiraganaDakuten : katakanaDakuten;
      case "combo":
        return kanaType === "hiragana" ? hiraganaCombinations : katakanaCombinations;
      default:
        return kanaType === "hiragana" ? hiragana : katakana;
    }
  });
  const successRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [gif, setGif] = useState<string | undefined>(undefined); // Initialize with undefined or a default

  const gifCache = useRef<Record<string, HTMLImageElement>>({});

  const [mistakes, setMistakes] = useState(0);
  const [wrongCharacters, setWrongCharacters] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setShowBoard(false);

    // Obtener el valor de localStorage
    const data = localStorage.getItem("learn2");
    let tutorialHasBeenShown = false;

    try {
      if (data) {
        // Asume que si el valor existe, ya se ha mostrado
        tutorialHasBeenShown = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error al parsear localStorage 'learn2'", error);
      // En caso de error, trata el tutorial como no mostrado para que se ejecute una vez
      tutorialHasBeenShown = false;
    }

    // Si el tutorial NO se ha mostrado, inicia el tour
    if (!tutorialHasBeenShown) {
      driverObj1.drive();
      // Y guarda el estado para que no se vuelva a mostrar
    }

    // El return del useEffect para la limpieza debe estar fuera del if
    return () => {
      driverObj1.destroy();
    };
  }, []);

  // Precargar GIFs
  useEffect(() => {
    const allKana = kanaType === "hiragana" ? hiragana : katakana;
    const gifFiles = allKana
      .flat()
      .filter((item): item is Kana => typeof item === "object" && !!item.gif)
      .map((item) => ({
        path: `/gifs/${kanaType}/${item.gif}`,
        name: item.gif,
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

  const boardRef = useRef<BoardRef | null>(null);
  const [showGif, setShowGif] = useState(true);

  const [selectedRow, setSelectedRow] = useState(1);
  const [selectedCol, setSelectedCol] = useState(1);

  const [progress, setProgress] = useState<Progress | null>(null);

  // This effect ensures media sources are updated when selectedKana changes.
  // It should *set* the audio object, not play it yet.
  useEffect(() => {
    const currentKana = kana[selectedRow]?.[selectedCol];
    if (typeof currentKana === "object" && currentKana.sound) {
      setAudio(new Audio(`/sounds/${currentKana.sound}`));
      setGif(currentKana.gif);
    } else {
      setAudio(null);
      setGif(undefined);
    }
  }, [selectedCol, selectedRow, kana]); // Added kana to dependency array for completeness

  const verifyKana = () => {
    const currentKana = kana[selectedRow]?.[selectedCol];

    if (typeof currentKana === "object" && currentKana !== null) {
      if (currentKana.strokes === boardRef.current?.strokesLength) {
        // Crear una copia del array para no mutar el estado directamente
        const updatedKana = kana.map((row, rowIndex) =>
          rowIndex === selectedRow
            ? row.map((item, colIndex) =>
                colIndex === selectedCol &&
                typeof item === "object" &&
                item !== null
                  ? { ...item, todo: true }
                  : item
              )
            : row
        );
        if (successRef.current) {
          successRef.current.currentTime = 0;
          successRef.current.play();
        }
        setKana(updatedKana);
        setShowBoard(false);
      } else {
        if (wrongRef.current) {
          wrongRef.current.currentTime = 0;
          wrongRef.current.play();
        }
        alert(
          `Inténtalo de nuevo. El número de trazos esperado es ${currentKana.strokes}, y has realizado ${boardRef.current?.strokesLength}.`
        );

        if (currentKana.label && !wrongCharacters.has(currentKana.label)) {
          setMistakes((prevMistakes) => prevMistakes + 1);
          setWrongCharacters((prevSet) =>
            new Set(prevSet).add(currentKana.label)
          );
        }

        return;
      }
    }

    handleNext();
  };

  function navigateToKana(row: number, col: number) {
    if (typeof kana[row][col] === "object") {
      setSelectedRow(row);
      setSelectedCol(col);
      clearCanvas();
      setShowBoard(true);

      // Play sound explicitly ONLY when a Kana is clicked
      // Use a small timeout to ensure the audio state has updated after setSelectedRow/Col
      // This is a common pattern to ensure state updates have propagated.
      setTimeout(() => {
        const currentKana = kana[row]?.[col];
        if (typeof currentKana === "object" && currentKana.sound) {
          new Audio(`/sounds/${currentKana.sound}`)
            .play()
            .catch((error) =>
              console.error("Error playing audio on click:", error)
            );
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
      if (
        nextRow >= kana.length - 1 &&
        nextCol >= kana[kana.length - 1].length - 1
      ) {
        setSelectedRow(1);
        setSelectedCol(1);
        clearCanvas();
        changeMediaSources();
        return;
      }

      if (nextCol >= kana[nextRow].length - 1) {
        nextRow++;
        nextCol = 1;
      } else {
        nextCol++;
      }

      // Verificar si la celda actual contiene un objeto Kana con sonido
      const currentItem = kana[nextRow]?.[nextCol];
      if (
        currentItem &&
        typeof currentItem === "object" &&
        (currentItem as Kana).sound
      ) {
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
    if (
      (kana[selectedRow][selectedCol] as Kana).sound == null ||
      (kana[selectedRow][selectedCol] as Kana).sound.length < 1
    )
      return;
    setAudio(
      new Audio(`/sounds/${(kana[selectedRow][selectedCol] as Kana).sound}`)
    );
    setGif((kana[selectedRow][selectedCol] as Kana).gif);
  }, [kana, selectedRow, selectedCol]);

  function clearCanvas() {
    boardRef.current?.clearCanvas();
  }

  function resetAll() {
    clearCanvas();
    resetProgress();

    setSelectedRow(1);
    setSelectedCol(1);
  }

  function resetProgress() {
    let kanaList = [...kana];

    kanaList.forEach((_, row) => {
      return kanaList[row].forEach((quiz, _) => {
        if (typeof quiz === "object") {
          quiz.todo = false;
        }
      });
    });

    setKana(kanaList);
  }

  function verifyProgress() {
    let total = 0;
    let doIt = 0;

    kana.forEach((_, row) => {
      kana[row].forEach((quiz, _) => {
        if (typeof quiz === "object") {
          total++;

          if (quiz.todo) {
            doIt++;
          }
        }
      });
    });

    const calc = ((doIt - mistakes) / total) * 100;

    const result = Math.round(calc);
    console.log(`${result}%`);

    if (doIt <= 0 && result <= 0) {
      setProgress(null);
      return;
    } else {
      setProgress({ total, doIt, progress: result });
      setShowProgress(true);
    }

    resetAll();
  }

  function restart() {
    changeMediaSources();
    setProgress(null);
    setShowProgress(false);
  }

  return (
    <>
      <Scaffold
        topBar={<NavigationTopBar isPrevActive />}
        bottomBar={<NavigationBottomBar />}
      >
        <>
          <h2 className="text-lg text-center">
            Complete la Tabla de Caracteres
          </h2>
          <KanaGrid
            kana={kana}
            selectedCol={selectedCol}
            selectedRow={selectedRow}
            navigateToKana={navigateToKana}
          />

          <Button
            onClick={() => {
              verifyProgress();
            }}
          >
            Finalizar
          </Button>
        </>
      </Scaffold>

      <BottomSheet
        isVisible={showProgress}
        setIsVisible={setShowProgress}
        showClose={false}
      >
        <StartView progress={progress} kanaType={kanaType} restart={restart} />
      </BottomSheet>

      <BottomSheet isVisible={showBoard} setIsVisible={setShowBoard} showClose>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex gap-2 items-center justify-center">
            <span
              id="character"
              className="bg-characters dark:bg-dark-characters text-dark-characters dark:text-characters w-auto inline-flex justify-center items-center rounded-md h-[40px] px-4 outline outline-gray-700"
            >
              caracter:{" "}
              <strong className="text-primary dark:text-dark-primary uppercase">
                {"("}
                {removeExtensionName(
                  (kana[selectedRow][selectedCol] as Kana).sound
                )}
                {")"}
              </strong>
            </span>
          </div>
          <Board ref={boardRef}>
            <>
              <div className="flex gap-2 items-end justify-center absolute top-4 inset-x-0 w-min mx-auto z-10">
                <div
                  className="bg-characters dark:bg-dark-characters  rounded-xl"
                  id="show-guide-to-draw"
                >
                  <button
                    onClick={() => setShowGif(!showGif)}
                    className="bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150"
                  >
                    {showGif ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>

                <div
                  className="bg-characters dark:bg-dark-characters  rounded-xl"
                  id="sound"
                >
                  <button
                    onClick={() => audio?.play()}
                    className="bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150"
                  >
                    <LuVolume2 />
                  </button>
                </div>
              </div>

              {gif && (
                <img
                  className={`w-full mix-blend-multiply pt-[70px] h-full object-contain absolute inset-0 m-auto pointer-events-none transition-opacity duration-300 ${
                    showGif ? "opacity-30" : "opacity-0"
                  } `}
                  src={`/gifs/${
                    kanaType === "hiragana" ? "hiragana" : "katakana"
                  }/${gif}`}
                  width="10px"
                  height="10px"
                  alt="GIF animado del trazo del kanji"
                />
              )}
            </>
          </Board>

          <Button id="verify" onClick={() => verifyKana()}>
            Verificar
          </Button>
          <div className="hidden">
            <audio src="/success.mp3" ref={successRef} />
            <audio src="/wrong.mp3" ref={wrongRef}></audio>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
