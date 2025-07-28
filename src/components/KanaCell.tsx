import { memo } from "react"
import type { KanaGrid } from "../data/kana"

interface KanaCellProps {
    item: KanaGrid,
    isSelected: boolean,
    isDecoration: boolean,
    isTodo: boolean,
    isGuide: boolean
    onClick: () => void
}
const KanaCell = memo(({ item, isSelected, isDecoration, isGuide, isTodo, onClick }: KanaCellProps) => {
    return (
        <div
            onClick={onClick}
            className={`w-full h-[50px] font-jpn border transition-all text-characters dark:text-dark-characters duration-150 border-decoration flex justify-center items-center bg-background dark:bg-dark-background
                ${isDecoration && 'bg-decoration!'}
                ${isGuide && 'bg-contrast-bg dark:bg-dark-contrast-bg text-characters dark:text-dark-characters font-bold'}  
                ${isSelected && 'bg-primary dark:bg-dark-primary font-bold text-characters dark:text-dark-characters border-characters dark:border-dark-characters -translate-y-2'} 
                ${isTodo && 'bg-green-200'} `}
        >
            {typeof item === 'object' && item !== null ? (
                item.label
            ) : (
                item
            )}
        </div>
    )
})

export default KanaCell
