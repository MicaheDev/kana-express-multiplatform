import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react"
import { LuEraser, LuRedo2, LuUndo2 } from "react-icons/lu";
import { useDraw } from "../hooks/useDraw";

export interface BoardRef {
    clearCanvas: () => void;
    strokesLength: number;
}

const Board = forwardRef<BoardRef, { children?: ReactNode }>(({ children }, ref) => {

    const canvasRef = useRef<HTMLCanvasElement>(null); // Asegúrate de que useRef tenga el tipo correcto

    // Usa tu hook de dibujo, pasando el canvasRef
    const { startDraw, drawing, clearCanvas, undo, redo, historyIndex, history, strokesRef } = useDraw(canvasRef);

    // Usa useImperativeHandle para exponer los métodos y propiedades al ref del padre
    useImperativeHandle(ref, () => ({
        clearCanvas: clearCanvas, // Exponemos la función clearCanvas
        strokesLength: strokesRef.current // Exponemos la longitud actual de los trazos
    }));

    return (
        <>
            <div id="board" className="outline outline-characters dark:outline-dark-characters grow w-full h-full select-none relative rounded-2xl overflow-hidden bg-contrast dark:bg-dark-contrast-bg">

                <div className="h-[70px] w-full border-b" />
                <canvas
                    ref={canvasRef} // Asigna el ref interno al elemento canvas
                    className="w-full h-full"
                    onPointerDown={startDraw}
                    onPointerMove={drawing}
                    style={{ touchAction: 'none' }}
                ></canvas>


                <div className="absolute bottom-2 left-2" id="strokes">Trazos: {strokesRef.current}</div>


                <div className='bg-characters dark:bg-dark-characters  rounded-xl absolute top-4 right-2' id="eraser">
                    <button className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'
                        onClick={clearCanvas}>
                        <LuEraser />
                    </button>
                </div>


                <div className="absolute top-4 left-2 inline-flex gap-2 items-center">
                    <div className='bg-characters dark:bg-dark-characters rounded-xl' id="undo">

                        <button onClick={undo}
                            disabled={historyIndex <= 0}
                            className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'>
                            <LuUndo2 />
                        </button>
                    </div>
                    <div className='bg-characters dark:bg-dark-characters rounded-xl' id="redo">

                        <button onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className='bg-background dark:bg-dark-background  h-full p-3 rounded-xl border border-characters dark:border-dark-characters -translate-y-1.5 hover:translate-y-0 active:translate-y-0 transition-transform duration-150'>
                            <LuRedo2 />
                        </button>
                    </div>

                </div>

                {children}
            </div>

        </>
    )
})



export default Board
