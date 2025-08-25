import type { Progress } from "../LearnDetail";
import Button from "../../../components/Button";

type StartViewProps = {
  kanaType: string | undefined;
  progress: Progress | null;
  restart: () => void;
};

export default function StartView({
  kanaType,
  progress,
  restart,
}: StartViewProps) {
  const getProgressImage = (currentProgress: number) => {
    if (currentProgress >= 50) {
      return {
        src: "/gifs/omedeto.gif", // Felicidades
        alt: "Felicidades",
        message: "おめでとう",
        subMessage: "(felicidades!)",
      };
    } else if (currentProgress >= 21) {
      // Puedes cambiar esta imagen y mensaje a algo que represente progreso medio
      return {
        src: "/sad.webp", // Por ejemplo, para progreso bajo
        alt: "Sigue practicando",
        message: "頑張ろう", // Ganbarou (¡Hagámoslo!)
        subMessage: "(¡a seguir practicando!)",
      };
    } else {
      // Puedes cambiar esta imagen y mensaje a algo que represente progreso inicial o bajo
      return {
        src: "/gifs/damn.gif", // Por ejemplo, para progreso bajo
        alt: "Sigue practicando",
        message: "バカじゃないの？", // Ganbarou (¡Hagámoslo!)
        subMessage: "¿Eres tonto?",
      };
    }
  };

  const progressInfo = progress ? getProgressImage(progress.progress) : null;

  return (
    <div className="h-[80svh] w-full flex justify-center gap-6 items-center flex-col">
      <h1 className="font-bold text-2xl">Aprender {kanaType && kanaType}</h1>

      {progress != null && (
        <div className="flex justify-center items-center flex-col gap-6">
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

          {progress && progress.progress > 50 && (
            <audio src="/win.mp3" autoPlay></audio>
          )}
          <div className="flex flex-col gap-2 items-center">
            <h2>
              Tu progreso fue del{" "}
              <span className="text-green-500">{progress.progress}%</span>
            </h2>
            <h2>
              Realizastes {progress.doIt}/{progress.total}
            </h2>
          </div>
        </div>
      )}

      <Button onClick={restart}>Reiniciar</Button>
    </div>
  );
}
