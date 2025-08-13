import { useCallback, useEffect, useRef, useState } from "react"; // Importa useRef
import {
  HiraganaCombinationList,
  HiraganaDakutenList,
  HiraganaList,
  KatakanaCombinationList,
  KatakanaDakutenList,
  KatakanaList,
  Variations,
} from "../../../data/kana";
import Scaffold from "../../../components/Scaffold";
import NavigationTopBar from "../../../components/NavigationTopBar";
import NavigationBottomBar from "../../../components/NavigationBottomBar";
import Button from "../../../components/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { LoaderCircle } from "lucide-react";
import BottomSheet from "../../../components/BottomSheet";

type QuizItem = {
  kana: string;
  romaji: string;
};

const Quizes = {
  hiragana: {
    [Variations.mainKana]: HiraganaList,
    [Variations.dakutenKana]: HiraganaDakutenList,
    [Variations.combinationKana]: HiraganaCombinationList,
  },
  katakana: {
    [Variations.mainKana]: KatakanaList,
    [Variations.dakutenKana]: KatakanaDakutenList,
    [Variations.combinationKana]: KatakanaCombinationList,
  },
};

export default function PracticeModule() {
  let { kana } = useParams<{ kana: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const successRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);

  const variations = searchParams.getAll("variations");

  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [selectedChar, setSelectedChar] = useState<QuizItem | null>(null);
  const [input, setInput] = useState("");
  const [current, setCurrent] = useState(0);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const [mistakes, setMistakes] = useState(0);
  const [wrongCharacters, setWrongCharacters] = useState<Set<string>>(
    new Set()
  );

  const [isComplete, setIsComplete] = useState(false);

  const [average, setAverage] = useState<number | null>(null);


  // Reemplaza el useEffect principal con esto:
  useEffect(() => {
    const initialize = () => {
      const newQuizList: QuizItem[] = [];

      const newMode = kana === "hiragana" ? "hiragana" : "katakana";

      variations.forEach((variation) => {
        const kanaMap = Quizes[newMode][variation as Variations];
        if (kanaMap) {
          Object.entries(kanaMap).forEach(([kana, romaji]) => {
            newQuizList.push({ kana, romaji });
          });
        }
      });

      const shuffledList = [...newQuizList].sort(() => Math.random() - 0.5);
      setQuizList(shuffledList);
      setSelectedChar(shuffledList[current]);
    };

    const timer = setTimeout(initialize, 100); // Pequeño delay para evitar bucles
    return () => clearTimeout(timer);
  }, []); // Solo al montar

  const calculateAverage = useCallback(() => {
    if (quizList.length === 0) {
      setAverage(0);
      return;
    }
    // Caracteres que no han registrado ningún error único
    const charactersNotErrored = quizList.length - mistakes;
    // Calcula el porcentaje de acierto
    const currentAverage = (charactersNotErrored / quizList.length) * 100;
    setAverage(parseFloat(currentAverage.toFixed(2))); // Redondea a 2 decimales
  }, [mistakes, quizList.length]); // Dependencias: recalcular si cambian los errores o el tamaño de la lista

  function handleNext() {
    if (current >= quizList.length - 1) {
      setSelectedChar(quizList[0]);
      setCurrent(0);
      calculateAverage();
      setIsComplete(true);
      return;
    }

    let newCurrent = quizList[current + 1];
    setSelectedChar(newCurrent);
    setCurrent(current + 1);
    setInput("");

    setIsSuccess(false);
    setIsWrong(false);
  }

  function verify() {
    setIsWrong(false);

    const match = quizList.find((char) => char.kana === selectedChar?.kana);

    if (!match) {
      return;
    }

    if (match.romaji.toLowerCase() === input.toLowerCase()) {
      setIsSuccess(true);
      if (successRef.current) {
        successRef.current.currentTime = 0;
        successRef.current.play();
      }
      setTimeout(() => {
        handleNext();
      }, 500);
    } else {
      setIsWrong(true);
      if (wrongRef.current) {
        wrongRef.current.currentTime = 0;
        wrongRef.current.play();
      }

      // Si el carácter actual no ha registrado un error antes, lo añadimos al contador.
      if (selectedChar && !wrongCharacters.has(selectedChar.kana)) {
        setMistakes((prevMistakes) => prevMistakes + 1);
        setWrongCharacters((prevSet) =>
          new Set(prevSet).add(selectedChar.kana)
        );
      }
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      verify();
    }
  };

  const getProgressImage = (currentProgress: number) => {
    if (currentProgress >= 50) {
      return {
        src: "/gifs/omedeto.gif", // Felicidades
        alt: "Felicidades",
        message: "おめでとう",
        subMessage: "(¡felicidades!)",
      };
    } else if (currentProgress >= 21) {
      // Puedes cambiar esta imagen y mensaje a algo que represente progreso medio
      return {
        src: "/sad.webp", // Por ejemplo, para progreso bajo
        alt: "Esfuerzate un poco mas",
        message: "がんばれ", // Ganbarou (¡Hagámoslo!)
        subMessage: "(¡Esfuerzate un poco mas!)",
      };
    } else {
      // Puedes cambiar esta imagen y mensaje a algo que represente progreso inicial o bajo
      return {
        src: "/gifs/damn.gif",
        alt: "Sigue practicando",
        message: "バカじゃないの？",
        subMessage: "¿Eres tonto?",
      };
    }
  };

  const progressInfo = average != null ? getProgressImage(average) : null;

  return (
    <>
      <Scaffold
        topBar={<NavigationTopBar isPrevActive />}
        bottomBar={<NavigationBottomBar />}
      >
        <div className="flex flex-col gap-8 w-full h-full justify-center">
          <div
            className={`w-full h-1/2 flex justify-center min-h-[300px] transition-all duration-300 items-center border border-characters rounded-2xl shadow-up text-characters dark:text-dark-characters dark:border-dark-characters bg-contrast-bg dark:bg-dark-contrast-bg ${
              isSuccess ? "bg-green-300! dark:bg-green-500!" : ""
            } ${isWrong ? "bg-red-300! dark:bg-red-500!" : ""}`}
          >
            <h2 className="text-center text-[180px] font-jpn">
              {selectedChar?.kana || (
                <LoaderCircle className="animate-spin w-10 h-10" />
              )}
            </h2>
          </div>

          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyUp}
            placeholder="romaji"
            type="text"
            className="px-6 py-2 border-b border-b-characters dark:border-b-dark-characters outline-none text-2xl text-center"
          />
          <Button onClick={verify}>Validar</Button>
          <p className="text-center">fallos: {mistakes}</p>

          <div className="hidden">
            <audio src="/success.mp3" ref={successRef} />
            <audio src="/wrong.mp3" ref={wrongRef}></audio>
          </div>
        </div>
      </Scaffold>

      <BottomSheet
        isVisible={isComplete}
        setIsVisible={setIsComplete}
        showClose={false}
      >
        <div className="w-full h-full flex flex-col justify-center items-center gap-6">
          {progressInfo && (
            <div className="relative">
              <img
                src={progressInfo.src}
                className="rounded-xl object-cover min-h-[250px]"
                alt={progressInfo.alt}
              />
              <div className="absolute bottom-1 inset-x-0 mx-0">
                <h1 className="text-white! text-center mx-auto text-nowrap">
                  {progressInfo.message}
                </h1>
                <p className="text-white! text-center text-nowrap font-sans bg-black w-min mx-auto">
                  {progressInfo.subMessage}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            {" "}
            <h2>
              Tu progreso fue del{" "}
              <span className="text-green-500">{average}%</span>
            </h2>
            <h2>
              Realizastes {quizList.length - mistakes}/{quizList.length}
            </h2>
          </div>
          <Button
            onClick={() => {
              navigate("/practice");
              setIsComplete(false);
            }}
          >
            Volver
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
