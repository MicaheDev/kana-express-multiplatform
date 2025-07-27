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
            className={`w-[50px] h-[50px] font-jpn border border-neutral-300 flex justify-center items-center ${isDecoration && 'bg-neutral-300' } ${isGuide && 'bg-neutral-100'}  ${isSelected && 'bg-pink-400'} ${isTodo && 'bg-green-200'} `}
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
