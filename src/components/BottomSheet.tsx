import { LucideX } from "lucide-react"
import { useImperativeHandle } from "react";

export interface BottomSheetRef {
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

type BottomSheetProps = {
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    children?: React.ReactNode,
    className?: string,
    ref?: React.Ref<BottomSheetRef>
}

export default function BottomSheet({ isVisible, setIsVisible, children, className, ref }: BottomSheetProps) {

 // Expone setIsVisible a través de la referencia
    useImperativeHandle(ref, () => ({
        setIsVisible: setIsVisible,
    }));

    return (
        <div id="bottom-sheet" className={`${isVisible ? "translate-y-0" : "translate-y-full"}`}>

            <header id="bottom-sheet-header">
                <button onClick={() => setIsVisible(false)}>
                    <LucideX className="w-8 h-8 text-characters dark:text-dark-characters" />
                </button>
            </header>

            <div id="bottom-sheet-content" className={`${className ? className : ""}`}>
                {children && children}
            </div>
        </div>
    )
}
