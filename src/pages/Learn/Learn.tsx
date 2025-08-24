import { useEffect, useState } from "react";
import { HiraganaList, KatakanaList, Modes } from "../../data/kana";
import NavigationBottomBar from "../../components/NavigationBottomBar";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import Scaffold from "../../components/Scaffold";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
  const driverObj = driver({
    showProgress: true,
    smoothScroll: true, // Habilita el scroll suave para una mejor experiencia
     onCloseClick: () => {
      const tutorial = true;
      localStorage.setItem("learn1", JSON.stringify(tutorial));
      driverObj.destroy()
    },
    steps: [
      {
        element: "#selector-hiragana",
        popover: {
          title: "Elige el silabario",
          description:
            "Aquí puedes seleccionar el modo de aprendizaje **Hiragana**. Verás sus caracteres listos para practicar.",
          side: "right", // Cambiamos a 'right' para que no tape el otro botón
          align: "start",
        },
      },
      {
        element: "#selector-katakana",
        popover: {
          title: "O elige Katakana",
          description:
            "También puedes seleccionar el silabario **Katakana** para empezar a aprender estos caracteres.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#characters-to-learn > div:first-child",
        popover: {
          title: "Explora los caracteres",
          description:
            "En esta sección, se muestran todos los caracteres del silabario que has elegido. Puedes verlos antes de empezar.",
          side: "top", // Muestra el popover arriba para evitar el scroll lateral
          align: "center",
        },
      },
      {
        element: "#start-button",
        popover: {
          onNextClick: () => {
            const tutorial = true;
            localStorage.setItem("learn1", JSON.stringify(tutorial));

            driverObj.destroy();
          },

          title: "Comienza a practicar!",
          description:
            "Cuando estés listo, haz clic en este botón para iniciar la sesión de aprendizaje del silabario seleccionado.",
          side: "top",
          align: "center",
        },
      },
    ],
  });

  const navigate = useNavigate();

  const [selectedMode, setSelectedMode] = useState<Modes>(Modes.hiragana);

  const [kana, setKana] = useState(
    selectedMode === "hiragana"
      ? [...Object.entries(HiraganaList)]
      : [...Object.entries(KatakanaList)]
  );

  function changeSelection(item: MenuItem) {
    setSelectedMode(item.name as Modes);
    setKana(
      item.name === "hiragana"
        ? [...Object.entries(HiraganaList)]
        : [...Object.entries(KatakanaList)]
    );
  }

  // dentro de tu componente Learn
  useEffect(() => {

    // Obtener el valor de localStorage
    const data = localStorage.getItem("learn1");
    let tutorialHasBeenShown = false;

    try {
      if (data) {
        // Asume que si el valor existe, ya se ha mostrado
        tutorialHasBeenShown = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error al parsear localStorage 'learn1'", error);
      // En caso de error, trata el tutorial como no mostrado para que se ejecute una vez
      tutorialHasBeenShown = false;
    }

    // Si el tutorial NO se ha mostrado, inicia el tour
    if (!tutorialHasBeenShown) {
      driverObj.drive();
      // Y guarda el estado para que no se vuelva a mostrar
    }

    // El return del useEffect para la limpieza debe estar fuera del if
    return () => {
      driverObj.destroy();
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
                  onChange={() => changeSelection(item)}
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
        <div className="flex flex-col gap-6">
          <div
            id="characters-to-learn"
            className="grid grid-rows-10 grid-cols-5 gap-3"
          >
            {kana.map(([key, value]) => (
              <div
                key={key}
                className="shadow-up flex flex-col bg-contrast-bg text-characters dark:text-dark-characters dark:bg-dark-contrast-bg justify-center items-center p-2 rounded-xl border border-characters dark:border-dark-characters "
              >
                <h3 className="text-lg">{key}</h3>
                <p className="text-decoration text-xs">{value}</p>
              </div>
            ))}
          </div>

          <Button
            id="start-button"
            onClick={() => navigate(`/learn/${selectedMode}`)}
          >
            Comenzar
          </Button>
        </div>
      </Scaffold>
    </>
  );
}
