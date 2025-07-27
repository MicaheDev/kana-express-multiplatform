import KanaCell from "../../../components/KanaCell"
import type { KanaGrid } from "../../../data/kana"

type KanaGridProps = {
    kana: KanaGrid[][],
    selectedCol: number,
    selectedRow: number,
    navigateToKana: (row: number, col:number) => void
}

export default function KanaGrid({kana, selectedCol, selectedRow, navigateToKana}: KanaGridProps) {
    return (
        <div className="w-min h-min outline outline-gray-700 flex flex-col overflow-hidden rounded-xl select-none">
            {/* Filas*/}
            {kana.map((_, row) => (
                <div className="flex" key={`row-${row + 1}`}>
                    {/* Columnas */}
                    {kana[row].map((item, col) => {
                        return (
                            <KanaCell
                                key={`col-${col}`}
                                item={item}
                                isSelected={selectedRow === row && selectedCol === col}
                                isDecoration={row === 0 && col === 0}
                                isGuide={row === 0 || col === 0}
                                isTodo={typeof item === 'object' && item.todo}
                                onClick={() => navigateToKana(row, col)}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
        )
}
