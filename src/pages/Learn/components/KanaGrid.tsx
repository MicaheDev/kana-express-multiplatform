import KanaCell from "../../../components/KanaCell";
import type { KanaGrid } from "../../../data/kana";

type KanaGridProps = {
  kana: KanaGrid[][];
  selectedCol: number;
  selectedRow: number;
  navigateToKana: (row: number, col: number) => void;
};

export default function KanaGrid({
  kana,
  selectedCol,
  selectedRow,
  navigateToKana,
}: KanaGridProps) {
  return (
    <div
      id="grid"
      className="w-full bg-characters dark:bg-dark-characters outline border border-characters dark:border-dark-characters  outline-characters dark:outline-dark-characters flex flex-col rounded-xl select-none"
    >
      {/* Filas*/}
      {kana.map((_, row) => (
        <div className="flex" key={`row-${row + 1}`} id={`row-${row + 1}`}>
          {/* Columnas */}
          {kana[row].map((item, col) => {
            return (
              <KanaCell
                key={`col-${col}`}
                item={item}
                isSelected={selectedRow === row && selectedCol === col}
                isDecoration={row === 0 && col === 0}
                isGuide={row === 0 || col === 0}
                isTodo={typeof item === "object" && item.todo}
                onClick={() => navigateToKana(row, col)}
                className={row === 0 || col === 0 ? "guide" : ""}
                id={selectedRow === row && selectedCol === col ? "selected": ""}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
