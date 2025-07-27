import { useCallback, useEffect, useState, type RefObject } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineSound } from "react-icons/ai";
import { LuEraser, LuRedo2, LuUndo2 } from "react-icons/lu"
import getSvgPathFromStroke from "perfect-freehand"

interface CanvasHistory {
    imageData: ImageData | null;
}

// Esto es un desastre, necesito ayuda T_T, demasiadas props, me dio hueva hacerlo bien auqnue de todos modos aun no se como hacerlo XD
interface DrawBoardProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    ctx: CanvasRenderingContext2D | null;
    setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
    isDrawing: boolean
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    history: CanvasHistory[]
    setHistory: React.Dispatch<React.SetStateAction<CanvasHistory[]>>
    historyIndex: number
    setHistoryIndex: React.Dispatch<React.SetStateAction<number>>
    audio: HTMLAudioElement | null
    setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
    gif: string,
    setGif?: React.Dispatch<React.SetStateAction<string>>
    kanaType: string | undefined
    onStrokeEnd: () => void; // Prop para notificar el fin de un trazo
    clearCanvas(): void
    handleStrokeUndo(): void
}

interface Point {
    x: number;
    y: number;
}

export default function DrawBoard({ canvasRef, ctx, setCtx, isDrawing, setIsDrawing, history, setHistory, historyIndex, setHistoryIndex, audio, gif, kanaType, onStrokeEnd, clearCanvas, handleStrokeUndo }: DrawBoardProps) {


    const [isShowEx, setIsShowEx] = useState(true)
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]); // Array para almacenar los puntos del trazo actual



    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return;
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        setCtx(canvas.getContext("2d", { willReadFrequently: true }))

        if (!ctx) return;
        // Inicializa el historial con un estado vacío
        setHistory([{ imageData: ctx.getImageData(0, 0, canvas.width, canvas.height) || null }]);
        setHistoryIndex(0);

    }, [ctx])

    const toggleSound = () => {
        if (!audio) return;
        if (!audio.src === null) return;
        audio.play();
    };


    const saveState = () => {
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Crea un nuevo array de historial insertando el nuevo estado después del actual
        const newHistory = [...history.slice(0, historyIndex + 1), { imageData }];
        setHistory(newHistory);
        setHistoryIndex(historyIndex + 1);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            if (!isDrawing) return;
            setIsDrawing(false);
            if (!ctx) return;
            ctx.closePath();
            saveState();
            onStrokeEnd() // Prop para notificar el fin de un trazo

        };

        document.addEventListener('mouseup', handleMouseUp);

        // Limpiar los listeners al desmontar el componente
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [ctx, isDrawing, saveState, onStrokeEnd])


    function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
        if (e.button !== 0) return;

        setIsDrawing(true)
        setCurrentPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]); // Inicializa el primer punto

        if (!ctx) return;
        ctx.beginPath()
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // Mueve al primer punto
    }

    const drawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!ctx || !isDrawing) return;
        //console.log(`x: ${e.nativeEvent.offsetX}, y: ${e.nativeEvent.offsetY}`)
        const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        setCurrentPoints(prevPoints => [...prevPoints, newPoint]);


        // Genera el path suavizado usando perfect-freehand
        const stroke = getSvgPathFromStroke(currentPoints.map(p => [p.x, p.y]), {
            size: 20, // Grosor del trazo
            thinning: 0.3, // Influencia de la presión en el grosor (0: sin influencia; > 0: adelgaza con baja presión, engrosa con alta presión/lentitud).
            smoothing: 0.3, // Suavizado del trazo (0: muy suave; > 0: esquina cuadradas o rotas) 
            streamline: 0.5, // Estabilizador del trazo (0: desactivado, mano alzada; > 0: activado, mayor correción)
        });


        // Limpia el trazo anterior y dibuja el nuevo suavizado
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Vuelve a dibujar el historial anterior (opcional, si no quieres que se borre mientras dibujas)
        history.slice(0, historyIndex + 1).forEach(state => {
            if (state.imageData) {
                ctx.putImageData(state.imageData, 0, 0);
            }
        });

        // Dibuja el nuevo trazo suavizado
        ctx.beginPath();
        const path = new Path2D();
        // Mueve al primer punto del contorno
        if (stroke.length > 0) {
            path.moveTo(stroke[0][0], stroke[0][1]);

            // Dibuja líneas a través de los puntos restantes del contorno
            for (let i = 1; i < stroke.length; i++) {
                path.lineTo(stroke[i][0], stroke[i][1]);
            }
        }
        ctx.fill(path); // O ctx.stroke(path) si prefieres solo el contorno


    }, [ctx, isDrawing, currentPoints])



    const undo = () => {
        if (historyIndex > 0 && ctx && canvasRef.current) {
            setHistoryIndex((prevIndex) => prevIndex - 1);
            const previousState = history[historyIndex - 1];
            ctx.putImageData(previousState.imageData!, 0, 0);
            handleStrokeUndo()
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1 && ctx && canvasRef.current) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            const nextState = history[historyIndex + 1];
            ctx.putImageData(nextState.imageData!, 0, 0);
            onStrokeEnd()
        }
    };

    function getName(name: string) {
        // \. : Matches a literal dot
        // [^.]+ : Matches one or more characters that are NOT a dot
        // $ : Matches the end of the string
        return name.replace(/\.[^/.]+$/, "");
    }



    return (
        <>
            <div className="outline outline-gray-700 select-none relative rounded-2xl overflow-hidden bg-neutral-100">
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={700}
                    onMouseDown={startDraw}
                    onMouseMove={drawing}
                ></canvas>

                {
                    gif && <img
                        className={`w-full h-full object-contain absolute inset-0 m-auto pointer-events-none transition-opacity duration-300 ${isShowEx ? 'opacity-10' : 'opacity-0'}`}
                        src={`/gifs/${kanaType === 'hiragana' ? 'hiragana' : 'katakana'}/${gif}`}
                        width="10px"
                        height="10px"
                        alt="GIF animado" // Siempre es bueno añadir un texto alternativo
                    />
                }


                <button onClick={clearCanvas} className="bg-white w-[60px] absolute top-0 right-0 m-2 h-[60px] text-2xl outline outline-gray-700 justify-center">
                    <LuEraser />
                </button>

                <div className="flex flex-col gap-2 items-end justify-center absolute bottom-0 right-0 m-2">
                    <button onClick={() => setIsShowEx(!isShowEx)} className="bg-white w-[60px] h-[60px] text-2xl outline outline-gray-700 justify-center">

                        {isShowEx ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                        }
                    </button>
                    <button onClick={toggleSound} className="bg-white  text-2xl h-[60px] outline outline-gray-700 justify-center">
                        <AiOutlineSound /><span className="text-lg">{`"${getName(gif)}"`}</span>
                    </button>


                </div>

                <div className="absolute top-0 left-0 m-2 inline-flex gap-2 items-center">
                    <button onClick={undo}
                        disabled={historyIndex <= 0}
                        className="bg-white w-[60px] text-2xl h-[60px] outline outline-gray-700 justify-center disabled:opacity-30">
                        <LuUndo2 />
                    </button>
                    <button onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="bg-white w-[60px] text-2xl h-[60px] outline outline-gray-700 justify-center disabled:opacity-30">
                        <LuRedo2 />
                    </button>
                </div>
            </div>
        </>
    )
}
