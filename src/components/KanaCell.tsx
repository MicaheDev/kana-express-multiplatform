import { memo } from "react";
import type { KanaGrid } from "../data/kana";

interface KanaCellProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  item: KanaGrid;
  isSelected: boolean;
  isDecoration: boolean;
  isTodo: boolean;
  isGuide: boolean;
  onClick: () => void;
  className: string
}
const KanaCell = memo(
  ({
    item,
    isSelected,
    isDecoration,
    isGuide,
    isTodo,
    className,
    onClick,
    ...rest
  }: KanaCellProps) => {
    return (
      <div
        onClick={onClick}
        className={`w-full h-[50px] font-jpn border transition-all text-characters dark:text-dark-characters duration-150 border-decoration flex justify-center items-center bg-background dark:bg-dark-background ${className} 
                ${isDecoration ? "bg-decoration!" : ""}
                ${
                  isGuide
                    ? "bg-contrast-bg dark:bg-dark-contrast-bg text-characters dark:text-dark-characters font-bold"
                    : ""
                }  
                ${
                  isSelected
                    ? "bg-primary dark:bg-dark-primary font-bold text-characters dark:text-dark-characters border-characters dark:border-dark-characters -translate-y-2 active:translate-y-0"
                    : ""
                } 
                ${isTodo ? "bg-green-200 dark:bg-green-700! " : ""} `}
        {...rest}
      >
        {typeof item === "object" && item !== null ? item.label : item}
      </div>
    );
  }
);

export default KanaCell;
