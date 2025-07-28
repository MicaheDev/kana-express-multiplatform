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
        <div className={`bottom-sheet fixed flex flex-col overflow-hidden w-screen h-screen bg-background dark:bg-dark-background z-[100] duration-300 transition-transform top-0 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>

            <header className="h-[70px] shrink-0 border-b border-characters  w-full flex justify-end items-center px-3">
                <button onClick={() => setIsVisible(false)}>
                    <LucideX className="w-8 h-8 text-characters dark:text-dark-characters" />
                </button>
            </header>

            <div className={`grow overflow-y-auto p-6 flex justify-center items-start ${className}`}>
                {children && children}
            </div>
        </div>
    )
}
