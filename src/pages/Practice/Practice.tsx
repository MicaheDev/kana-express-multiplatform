import { useState, useEffect } from "react";
import { Modes } from "../../data/kana";
import PracticeMenu from "./components/PracticeMenu";

interface MenuItem {
  label: string;
  name: string;
}

interface KanaVariation extends MenuItem { }


const modeMenu: MenuItem[] = [
  {
    label: "Hiragana",
    name: "hiragana",
  },
  {
    label: "Katakana",
    name: "katakana",
  },
];

const initialVariationMenu: KanaVariation[] = [
  { label: "Kana Principal", name: "mainKana" },
  { label: "Dakuten Kana", name: "dakutenKana" },
  { label: "Kanas Combinados", name: "combinationKana" },
];

export default function Practice() {
  const [selectedMode, setSelectedMode] = useState<Modes>(Modes.hiragana);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [selectAllVariations, setSelectAllVariations] = useState<boolean>(false);

  const variationsMenu = initialVariationMenu; // Usar la constante fuera del componente

  useEffect(() => {
    if (selectAllVariations) {
      setSelectedVariations(variationsMenu.map((kana) => kana.name));
    } else {
      setSelectedVariations([]);
    }
  }, [selectAllVariations, variationsMenu]);

  useEffect(() => {
    if (selectedVariations.length === variationsMenu.length && variationsMenu.length > 0) {
      setSelectAllVariations(true);
    } else {
      setSelectAllVariations(false);
    }
  }, [selectedVariations, variationsMenu]);

  const handleVariationChange = (name: string) => {
    if (selectedVariations.includes(name)) {
      setSelectedVariations(selectedVariations.filter((item) => item !== name));
    } else {
      setSelectedVariations([...selectedVariations, name]);
    }
  };




  return (
    <>

      <PracticeMenu
        modeMenu={modeMenu}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedVariations={selectedVariations}
        onVariationChange={handleVariationChange}
        selectAllVariations={selectAllVariations}
        setSelectAllVariations={setSelectAllVariations}
        variationsMenu={variationsMenu}
      />

    </>
  );
}