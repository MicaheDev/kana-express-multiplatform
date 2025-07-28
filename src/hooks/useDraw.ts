import { useEffect, useRef, useState, type RefObject } from "react"
import getSvgPathFromStroke from "perfect-freehand"

interface Point {
    x: number;
    y: number;
}

interface CanvasHistory {
    imageData: ImageData | null;
}

const STROKE_CONFIG = {
    size: 10, // Grosor del trazo
    thinning: 0.3, // Influencia de la presión en el grosor (0: sin influencia; > 0: adelgaza con baja presión, engrosa con alta presión/lentitud).
    smoothing: 0, // Suavizado del trazo (0: muy suave; > 0: esquina cuadradas o rotas) 
    streamline: 0.6, // Estabilizador del trazo (0: desactivado, mano alzada; > 0: activado, mayor correción)
}

export const useDraw = (canvasRef: RefObject<HTMLCanvasElement | null>) => {

    //const ctxRef: RefObject<CanvasRenderingctx2D | null> = useRef(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

    // Draw
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]); // Array para almacenar los puntos del trazo actual
    const strokesRef = useRef(0); // Ref para almacenar el número de trazos
    const [strokeColor, setStrokeColor] = useState<string>("#000000"); // Nuevo estado para el color del trazo (negro por defecto)

    //History
    const [history, setHistory] = useState<CanvasHistory[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);


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

      // Efecto para detectar y actualizar el tema del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Si el tema es oscuro, usa blanco; de lo contrario, usa negro.
            setStrokeColor(e.matches ? "#FFFFFF" : "#000000");
        };

        // Establece el color inicial al cargar
        setStrokeColor(mediaQuery.matches ? "#FFFFFF" : "#000000");

        // Añade el listener para cambios futuros
        mediaQuery.addEventListener('change', handleChange);

        // Limpia el listener cuando el componente se desmonte
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []); // Se ejecuta una sola vez al montar el componente




    function onStrokeEnd() {
        strokesRef.current += 1;
    }


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

        document.addEventListener("pointerup", handleMouseUp);

        // Limpiar los listeners al desmontar el componente
        return () => {
            document.removeEventListener('pointerup', handleMouseUp);
        };
    }, [ctx, isDrawing, saveState, onStrokeEnd])



    function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
        //if (e.button !== 0) return;

        setIsDrawing(true)
        setCurrentPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]); // Inicializa el primer punto

        if (!ctx) return;
        ctx.beginPath()
        ctx.lineWidth = STROKE_CONFIG.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = strokeColor;

        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // Mueve al primer punto
    }


    const drawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!ctx || !isDrawing) return;
        const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        setCurrentPoints(prevPoints => [...prevPoints, newPoint]);


        // Genera el path suavizado usando perfect-freehand
        const stroke = getSvgPathFromStroke(currentPoints.map(p => [p.x, p.y]), STROKE_CONFIG);


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


    }


    function clearCanvas() {
        const canvas = canvasRef.current
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([{ imageData: ctx.getImageData(0, 0, canvas.width, canvas.height) || null }]);
        setHistoryIndex(0);
        strokesRef.current = 0
    }

    const undo = () => {
        if (historyIndex > 0 && ctx && canvasRef.current) {
            setHistoryIndex((prevIndex) => prevIndex - 1);
            const previousState = history[historyIndex - 1];
            ctx.putImageData(previousState.imageData!, 0, 0);
            strokesRef.current -= 1;
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1 && ctx && canvasRef.current) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            const nextState = history[historyIndex + 1];
            ctx.putImageData(nextState.imageData!, 0, 0);
            strokesRef.current += 1;

        }
    };



    return { startDraw, drawing, clearCanvas, undo, redo, historyIndex, history, strokesRef }
}

