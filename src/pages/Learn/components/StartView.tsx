import type { Progress } from '../LearnDetail';
import Button from '../../../components/Button';

type StartViewProps = {
    kanaType: string | undefined,
    progress: Progress | null,
    restart: () => void

}

export default function StartView({ kanaType, progress, restart }: StartViewProps) {
    return (
        <div className="h-[80svh] w-full flex justify-center gap-4 items-center flex-col">

            <h1 className="font-bold uppercase text-2xl">Aprender {kanaType && kanaType}</h1>

            {
                progress != null && <div className="flex justify-center items-center flex-col">
                    <h2>Tu progreso fue del <span className="text-green-500">{progress.progress}%</span></h2>
                    <h2>Realizastes {progress.doIt}/{progress.total}</h2>
                </div>
            }


            <Button onClick={restart}>
                Reiniciar
            </Button>
        </div>
    )
}
