import { useEffect, useState, useRef } from "react"; // Importa useRef
import { HiraganaCombinationList, HiraganaDakutenList, HiraganaList, KatakanaCombinationList, KatakanaDakutenList, KatakanaList, Modes, Variations } from "../../../data/kana";

interface PracticeModuleProps {
  mode: Modes,
  variations: string[],
  onReset: () => void
}

type QuizItem = {
  kana: string;
  romaji: string;
  hasError: boolean;
};

export default function PracticeModule({ mode, variations, onReset }: PracticeModuleProps) {
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
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [answered, setAnswered] = useState<string[]>([]);

  // Array de refs para los inputs
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  console.log(progress)

  useEffect(() => {
    setQuizList([]);
    setAnswered([]);
    setErrorCount(0);
    setProgress(0);
    const newQuizList: QuizItem[] = [];

    variations.forEach((variation) => {
      const kanaMap = Quizes[mode][variation as Variations];
      if (kanaMap) {
        Object.entries(kanaMap).forEach(([kana, romaji]) => {
          newQuizList.push({ kana, romaji, hasError: false });
        });
      }
    });

    const shuffledList = [...newQuizList].sort(() => Math.random() - 0.5);
    setQuizList(shuffledList);
    // Reinicia las referencias cuando la quizList cambie
    inputRefs.current = new Array(shuffledList.length).fill(null);
  }, [mode, variations]);

  const validate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    quizItem: QuizItem,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      const inputValue = e.currentTarget.value.trim().toLowerCase();
      const isCorrect = inputValue === quizItem.romaji;

      const updatedQuizList = [...quizList];
      const updatedAnswered = [...answered];
      let newErrorCount = errorCount;

      if (isCorrect) {
        if (!answered.includes(quizItem.kana)) {
          updatedAnswered.push(quizItem.kana);
          setAnswered(updatedAnswered);
          setProgress(prev => prev + 1); // Incrementa el progreso
        }
        updatedQuizList[index].hasError = false;
        setQuizList(updatedQuizList);

        // Mueve el foco al siguiente input
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus();
        } else {
          // Si no hay más inputs, puedes decidir qué hacer, por ejemplo, resetear o enfocar el primero
          // inputRefs.current[0]?.focus();
        }

      } else {
        updatedQuizList[index].hasError = true;
        setQuizList(updatedQuizList);
        if (!answered.includes(quizItem.kana) && !updatedAnswered.includes(quizItem.kana)) {
          newErrorCount++;
          setErrorCount(newErrorCount);
        }
        setTimeout(() => {
          const resetQuizList = [...quizList];
          resetQuizList[index].hasError = false;
          setQuizList(resetQuizList);
        }, 1000);
      }
    }
  };
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center my-8 mx-auto px-2">

      <div className="grid grid-cols-4 row-auto gap-4">
        {
          quizList.map((quiz, index) => (
            <div
              key={quiz.kana}
              className={`w-[250px] h-[250px] shadow outline outline-gray-700 rounded-2xl gap-4 flex flex-col justify-evenly items-center transition-colors duration-500 ${quiz.hasError ? 'bg-red-200 outline-red-500' : answered.includes(quiz.kana) ? 'bg-green-200 outline-green-500' : ''}`}>
              <h1 className="text-8xl font-jpn">{quiz.kana}</h1>
              <input
                onKeyDown={(e) => validate(e, quiz, index)}
                type="text"
                className="px-4 py-2 w-[200px] text-center font-bold border-b outline-none border-gray-700"
                ref={(el: HTMLInputElement) => {
                  inputRefs.current[index] = el;
                }} />
            </div>
          ))
        }
      </div>

      <button onClick={onReset} className="bg-pink-400">Finalizar</button>
    </div>
  )
}