import { useImperativeHandle, useRef, type ReactNode, type RefObject } from "react"
import { LuEraser, LuRedo2, LuUndo2 } from "react-icons/lu";
import { useDraw } from "../hooks/useDraw";

export interface BoardRef {
    clearCanvas: () => void;
    strokesLength: number;
}

const Board = ({ children, ref }: { children?: ReactNode, ref: React.Ref<BoardRef> }) => {

    const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)

    const { startDraw, drawing, clearCanvas, undo, redo, historyIndex, history, strokesRef } = useDraw(canvasRef)


    useImperativeHandle(ref, () => ({
        clearCanvas: clearCanvas,
        strokesLength: strokesRef.current
        // Si tienes otras funciones, las añadirías aquí
    }));


    return (
        <>
            <div className="outline outline-gray-700 w-[700px] h-[700px] select-none relative rounded-2xl overflow-hidden bg-neutral-100">

                <canvas
                    ref={canvasRef}
                    width={700}
                    height={700}
                    onMouseDown={startDraw}
                    onMouseMove={drawing}
                ></canvas>

                <button onClick={clearCanvas} className="bg-white w-[60px] absolute top-0 right-0 m-2 h-[60px] text-2xl outline outline-gray-700 justify-center">
                    <LuEraser />
                </button>


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

                {children}
            </div>

        </>
    )
}

export default Board
