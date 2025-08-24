import type { Modes } from "../../../data/kana";
import Scaffold from "../../../components/Scaffold";
import NavigationBottomBar from "../../../components/NavigationBottomBar";
import Button from "../../../components/Button";
import { createSearchParams, useNavigate } from "react-router";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

interface MenuItem {
  label: string;
  name: string;
}

interface PracticeMenuProps {
  modeMenu: MenuItem[];
  selectedMode: string;
  setSelectedMode: React.Dispatch<React.SetStateAction<Modes>>;
  selectedVariations: string[];
  onVariationChange: (name: string) => void;
  selectAllVariations: boolean;
  setSelectAllVariations: React.Dispatch<React.SetStateAction<boolean>>;
  variationsMenu: MenuItem[];
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
  
  const practice1 = driver({
    showProgress: true,
    smoothScroll: true, // Habilita el scroll suave para una mejor experiencia
    onCloseClick: () => {
      const tutorial = true;
      localStorage.setItem("practice1", JSON.stringify(tutorial));
      practice1.destroy();
    },

    steps: [
      {
        popover: {
          title: "¡Bienvenido al modo práctica!",
          description:
            "Este módulo es para que demuestres lo que ya sabes. Si aún no has aprendido los caracteres, te recomendamos ir al **Módulo de Aprendizaje** primero para familiarizarte con ellos.",
        },
      },
      {
        element: "#selector-hiragana",
        popover: {
          title: "Elige el silabario",
          description:
            "Selecciona el silabario de **Hiragana** para empezar a practicar.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#selector-katakana",
        popover: {
          title: "O elige Katakana",
          description:
            "También puedes seleccionar el silabario de **Katakana** para practicar con estos caracteres.",
          side: "right",
          align: "start",
        },
      },

      {
        element: "#all",
        popover: {
          title: "Práctica completa",
          description:
            "Haz clic aquí para practicar **todas las variantes del silabario seleccionado**, incluyendo las combinaciones y los kana con marcas diacríticas.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#selector-1",
        popover: {
          title: "Kana principales",
          description:
            "Selecciona esta opción para practicar solo los caracteres principales, desde **あ** hasta **を** (si elegiste Hiragana) o **ア** hasta **ヲ** (si elegiste Katakana).",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#selector-2",
        popover: {
          title: "Dakuten y Handakuten",
          description:
            "Practica los kana con **marcas diacríticas (dakuten y handakuten)**, como **が** a **ぽ** o **ガ** a **ポ**.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#selector-3", // Asumo que este es el tercer selector, ya que tu código original tenía dos #selector-2
        popover: {
          title: "Combinaciones (yoon)",
          description:
            "Este modo es para practicar las **combinaciones de kana** (yoon), como **びゅ** (byu) y **にゃ** (nya).",
          side: "right",
          align: "start",
        },
      },

          {
        element: "#start-button",
        popover: {
          onNextClick: () => {
            const tutorial = true;
            localStorage.setItem("practice1", JSON.stringify(tutorial));

            practice1.destroy();
          },

          title: "¡Comienza a practicar!",
          description:
            "Cuando estés listo, haz clic en este botón para iniciar la sesión de practica del silabario seleccionado.",
          side: "top",
          align: "center",
        },
      },
    ],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el valor de localStorage
    const data = localStorage.getItem("practice1");
    let tutorialHasBeenShown = false;

    try {
      if (data) {
        // Asume que si el valor existe, ya se ha mostrado
        tutorialHasBeenShown = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error al parsear localStorage 'practice1'", error);
      // En caso de error, trata el tutorial como no mostrado para que se ejecute una vez
      tutorialHasBeenShown = false;
    }

    // Si el tutorial NO se ha mostrado, inicia el tour
    if (!tutorialHasBeenShown) {
      practice1.drive();
      // Y guarda el estado para que no se vuelva a mostrar
    }

    // El return del useEffect para la limpieza debe estar fuera del if
    return () => {
      practice1.destroy();
    };
  }, []);
  return (
    <>
      <Scaffold
        topBar={
          <header className="h-[70px] shrink-0 w-full flex text-characters dark:text-dark-characters border-b border-characters dark:border-dark-characters">
            {modeMenu.map((item) => (
              <label
                id={`selector-${item.name}`}
                key={`${item.label}`}
                htmlFor={item.name}
                className={`w-full h-full transition-all duration-300 cursor-pointer ${
                  item.name === selectedMode
                    ? "selected-decoration text-characters dark:text-dark-characters"
                    : "text-decoration"
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
        }
        bottomBar={<NavigationBottomBar />}
      >
        <div className="flex flex-col w-full h-full justify-center gap-8">
          <h1 className="text-center text-xl">Selecciona una variante</h1>
          <label
            id="all"
            htmlFor="all-kana"
            className={`select-box w-full outline outline-decoration h-max rounded-2xl transition-all duration-300 cursor-pointer ${
              selectAllVariations ? "check" : "text-decoration"
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
              <p className="font-bold w-full text-center ">Todos los kana</p>
            </div>
          </label>
          <hr />
          <div className="flex flex-col justify-between items-start gap-4">
            {variationsMenu.map((item, index) => (
              <label
                id={`selector-${index + 1}`}
                key={`${item.label}`}
                htmlFor={item.name}
                className={`select-box w-full outline outline-decoration h-max rounded-2xl transition-all duration-300 cursor-pointer ${
                  selectedVariations.includes(item.name)
                    ? "check"
                    : "text-decoration"
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
                  <p className="font-bold w-full text-center">{item.label}</p>
                </div>
              </label>
            ))}
          </div>

          <Button
          id="start-button"
            onClick={() => {
              if (selectedVariations.length < 1) {
                alert("Por favor selecciona una variación");
                return;
              }
              const params = createSearchParams({
                variations: selectedVariations,
              });
              navigate({
                pathname: `/practice/${selectedMode}`,
                search: `?${params.toString()}`,
              });
            }}
          >
            Empezar Practica
          </Button>
        </div>
      </Scaffold>
    </>
  );
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
