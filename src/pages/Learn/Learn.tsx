import { useState } from "react";
import { HiraganaList, KatakanaList, Modes } from "../../data/kana";
import NavigationBottomBar from "../../components/NavigationBottomBar";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import Scaffold from "../../components/Scaffold";

interface MenuItem {
  label: string;
  name: string;
}
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
export default function Learn() {

  const navigate = useNavigate()

  const [selectedMode, setSelectedMode] = useState<Modes>(Modes.hiragana);

  const [kana, setKana] = useState(selectedMode === 'hiragana' ? [...Object.entries(HiraganaList)] : [...Object.entries(KatakanaList)]);

  function changeSelection(item: MenuItem) {
    setSelectedMode(item.name as Modes)
    setKana(item.name === 'hiragana' ? [...Object.entries(HiraganaList)] : [...Object.entries(KatakanaList)])
  }

  return (

    <>

      <Scaffold topBar={<header className="h-[70px] shrink-0 w-full flex text-characters dark:text-dark-characters border-b border-characters dark:border-dark-characters">

        {modeMenu.map((item) => (
          <label
            key={`${item.label}`}
            htmlFor={item.name}
            className={`w-full h-full transition-all duration-300 cursor-pointer ${item.name === selectedMode ? "selected-decoration text-characters dark:text-dark-characters" : "text-decoration"
              }`}
          >
            <input
              className="hidden"
              name="kana-selection"
              type="radio"
              id={item.name}
              value={item.name}
              checked={selectedMode === item.name}
              onChange={() => changeSelection(item)}
            />
            <div className="flex justify-center items-center w-full h-full">
              <p className="font-bold w-full text-center text-lg">
                {item.label}
              </p>
            </div>
          </label>
        ))}
      </header>} bottomBar={<NavigationBottomBar />}>
       <div className="flex flex-col gap-6">
         <div className="grid grid-rows-10 grid-cols-5 gap-3">
          {kana.map(([key, value]) => (
            <div key={key} className="shadow-up flex flex-col bg-contrast-bg text-characters dark:text-dark-characters dark:bg-dark-contrast-bg justify-center items-center p-2 rounded-xl border border-characters dark:border-dark-characters ">
              <h3 className="text-lg">{key}</h3>
              <p className="text-decoration text-xs">{value}</p>
            </div>
          ))}

        </div>


        <Button onClick={() => navigate(`/learn/${selectedMode}`)}>
          Comenzar
        </Button>
       </div>
      </Scaffold>
   
    </>
  )
}
