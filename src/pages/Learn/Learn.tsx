import { useState } from "react";
import { HiraganaList, Modes } from "../../data/kana";
import NavigationBottomBar from "../../components/NavigationBottomBar";

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

  const [selectedMode, setSelectedMode] = useState<Modes>(Modes.hiragana);
  return (

    <div className="overflow-hidden w-screen h-screen flex flex-col">
      <div className="h-[20px] shrink-0"></div>
      <header className="h-[70px] shrink-0 w-full flex text-characters dark:text-dark-characters border-b border-characters dark:border-dark-characters">

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
              onChange={() => setSelectedMode(item.name as Modes)}
            />
            <div className="flex justify-center items-center w-full h-full">
              <p className="font-bold w-full text-center text-lg">
                {item.label}
              </p>
            </div>
          </label>
        ))}
      </header>
      <div className="grow h-full overflow-y-auto p-6 flex gap-4 flex-col">
        <div className="grid grid-rows-10 grid-cols-5 gap-3">
          {Object.entries(HiraganaList).map(([key, value]) => (
            <div key={key} className="shadow-up flex flex-col bg-contrast-bg text-characters dark:text-dark-characters dark:bg-dark-contrast-bg justify-center items-center p-2 rounded-xl border border-characters dark:border-dark-characters ">
              <h3 className="text-lg">{key}</h3>
              <p className="text-decoration text-xs">{value}</p>
            </div>
          ))}

        </div>

        <button className="btn-primary">Comenzar</button>

      </div>

      <NavigationBottomBar/>
    </div>
  )
}
