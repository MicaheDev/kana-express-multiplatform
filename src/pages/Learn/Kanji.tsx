import { Link } from "react-router";
import { courses } from "../../data/kanji";

export default function Kanji() {

  return (
    <div className="w-full h-full flex flex-col items-center justify-center my-8 mx-auto px-2 gap-8">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="uppercase text-2xl font-bold">
          Selecciona un modulo del curso
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi earum
          adipisci incidunt magni hic asperiores ipsa eaque magnam nulla dolore.
        </p>
      </div>
      <div className="grid grid-cols-4 row-auto gap-4">      {
        courses.map((course) => (
          <Link to={`/learn/kanji/${course.id}`} key={`module_${course.id}`}
            className={`w-[250px] h-[250px] outline outline-gray-700 rounded-2xl gap-4 flex flex-col hover:scale-95 transition-all duration-300 relative `}>


            <div className="w-full h-3/12 flex justify-center items-center">
              <h1 className="text-xl font-bold uppercase">{course.id} {course.name}</h1>
            </div>

            <div className="w-full h-3/4 border-t border-t-gray-700 flex justify-center items-center">
              <h1 className="text-8xl font-bold font-jpn">{course.data[0].label}</h1>

            </div>
          </Link>
        ))
      }
      </div>
    </div>
  )
}
