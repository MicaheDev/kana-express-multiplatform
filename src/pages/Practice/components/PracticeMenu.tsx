import type { Modes } from "../../../data/kana";
import Scaffold from "../../../components/Scaffold";
import NavigationBottomBar from "../../../components/NavigationBottomBar";
import Button from "../../../components/Button";
import { createSearchParams, useNavigate } from "react-router";

interface MenuItem {
    label: string;
    name: string;
}

interface PracticeMenuProps {
    modeMenu: MenuItem[],
    selectedMode: string,
    setSelectedMode: React.Dispatch<React.SetStateAction<Modes>>,
    selectedVariations: string[]
    onVariationChange: (name: string) => void;
    selectAllVariations: boolean
    setSelectAllVariations: React.Dispatch<React.SetStateAction<boolean>>
    variationsMenu: MenuItem[]
}

export default function PracticeMenu({
    modeMenu,
    selectedMode,
    setSelectedMode,
    selectedVariations,
    onVariationChange,
    setSelectAllVariations,
    selectAllVariations,
    variationsMenu,
}: PracticeMenuProps) {
    const navigate = useNavigate()
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
                            onChange={() => setSelectedMode(item.name as Modes)}
                        />
                        <div className="flex justify-center items-center w-full h-full">
                            <p className="font-bold w-full text-center text-lg">
                                {item.label}
                            </p>
                        </div>
                    </label>
                ))}
            </header>} bottomBar={<NavigationBottomBar />}>

                <div className="flex flex-col w-full h-full justify-center gap-8">
                    <h1 className="text-center text-xl">Selecciona una variante</h1>
                    <label
                        htmlFor="all-kana"
                        className={`select-box w-full outline outline-decoration h-max rounded-2xl transition-all duration-300 cursor-pointer ${selectAllVariations ? "check" : "text-decoration"
                            }`}
                    >
                        <input
                            className="hidden"
                            name="kana-variation-all"
                            type="checkbox"
                            id="all-kana"
                            checked={selectAllVariations}
                            onChange={(e) => setSelectAllVariations(e.currentTarget.checked)}
                        />
                        <div className="flex justify-center items-center w-full h-full py-6 px-8">
                            <p className="font-bold w-full text-center ">
                                Todos los kana
                            </p>
                        </div>
                    </label>
                    <hr />
                    <div className="flex flex-col justify-between items-start gap-4">
                        {variationsMenu.map((item) => (
                            <label
                                key={`${item.label}`}
                                htmlFor={item.name}
                                className={`select-box w-full outline outline-decoration h-max rounded-2xl transition-all duration-300 cursor-pointer ${selectedVariations.includes(item.name) ? "check" : "text-decoration"
                                    }`}
                            >
                                <input
                                    className="hidden"
                                    name="kana-variation"
                                    type="checkbox"
                                    id={item.name}
                                    value={item.name}
                                    checked={selectedVariations.includes(item.name)}
                                    onChange={() => onVariationChange(item.name)}
                                />
                                <div className="flex justify-center items-center w-full h-full py-6 px-8">
                                    <p className="font-bold w-full text-center">
                                        {item.label}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <Button onClick={
                        () => {
                            if (selectedVariations.length < 1) {
                                alert("Por favor selecciona una variación")
                                return;
                            }
                            const params = createSearchParams({
                                variations: selectedVariations,
                            })
                            navigate({
                                pathname: `/practice/${selectedMode}`,
                                search: `?${params.toString()}`
                            })
                        }}>Empezar Practica</Button>
                </div>
            </Scaffold>
        </>
    )
}


/**
 * 
 * 
 *           <div className="flex flex-col min-h-[80svh] h-full items-center justify-center gap-8">
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="uppercase text-2xl font-bold">
                        Selecciona un silabario para practicar
                    </h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi earum
                        adipisci incidunt magni hic asperiores ipsa eaque magnam nulla dolore.
                    </p>
                </div>
                <div className="flex gap-4 justify-between items-center w-full h-min">
                    {modeMenu.map((item) => (
                        <label
                            key={`${item.label}`}
                            htmlFor={item.name}
                            className={`select-box w-full outline outline-gray-700 h-max rounded-2xl hover:scale-95 hover:opacity-80 transition-all duration-300 cursor-pointer ${item.name === selectedMode ? "check" : "text-gray-700"
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
                            <div className="flex justify-center items-center w-full h-full py-6 px-8">
                                <p className="uppercase font-bold w-full text-center text-3xl">
                                    {item.label}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 items-center">
                         <h1 className="uppercase text-2xl font-bold">
                        Selecciona una variación del silabario
                    </h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi earum
                            adipisci incidunt magni hic asperiores ipsa eaque magnam nulla
                            dolore.
                        </p>
                    </div>
                    <label
                        htmlFor="all-kana"
                        className={`select-box w-full outline outline-gray-700 h-max rounded-2xl hover:scale-95 hover:opacity-80 transition-all duration-300 cursor-pointer ${selectAllVariations ? "check" : "text-gray-700"
                            }`}
                    >
                        <input
                            className="hidden"
                            name="kana-variation-all"
                            type="checkbox"
                            id="all-kana"
                            checked={selectAllVariations}
                            onChange={(e) => setSelectAllVariations(e.currentTarget.checked)}
                        />
                        <div className="flex justify-center items-center w-full h-full py-6 px-8">
                            <p className="uppercase font-bold w-full text-center text-2xl">
                                Todos los kana
                            </p>
                        </div>
                    </label>

                    <div className="flex justify-between items-start gap-4">
                        {variationsMenu.map((item) => (
                            <label
                                key={`${item.label}`}
                                htmlFor={item.name}
                                className={`select-box w-full outline outline-gray-700 h-max rounded-2xl hover:scale-95 hover:opacity-80 transition-all duration-300 cursor-pointer ${selectedVariations.includes(item.name) ? "check" : "text-gray-700"
                                    }`}
                            >
                                <input
                                    className="hidden"
                                    name="kana-variation"
                                    type="checkbox"
                                    id={item.name}
                                    value={item.name}
                                    checked={selectedVariations.includes(item.name)}
                                    onChange={() => onVariationChange(item.name)}
                                />
                                <div className="flex justify-center items-center w-full h-full py-6 px-8">
                                    <p className="uppercase font-bold w-full text-center text-xl">
                                        {item.label}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, rerum.</p>
                <button onClick={onStart} className="bg-pink-400 outline outline-gray-700">
                    <span>Empezar practica</span><MdOutlineFlag className="text-xl" />
                </button>
            </div>
 */