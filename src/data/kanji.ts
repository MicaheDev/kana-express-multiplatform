export type Kanji = {
    gif: string,
    strokes: number,
    label: string,
    todo: boolean,
    explanation: string,
}

export type Course = {
    id: number,
    name: string,
    difficult: string,
    data: Kanji[]
}


export const courses: Course[] = [
    {
        id: 1,
        name: "numeros",
        difficult: "facil",
        data: [
            {
                gif: "一.gif",
                strokes: 1,
                label: "一",
                todo: false,
                explanation: "Si te das cuenta es el numero '1' en romano recostado."
            },
            {
                gif: "二.gif",
                strokes: 2,
                label: "二",
                todo: false,
                explanation: "De la misma forma es el numero '2' en romano recostado."

            },
            {
                gif: "三.gif",
                strokes: 3,
                label: "三",
                todo: false,
                explanation: "Aqui volvemos a ver el mismo patron, numero '3' en romano recostado."

            },
            {
                gif: "四.gif",
                strokes: 5,
                label: "四",
                todo: false,
                explanation: ""

            },
            {
                gif: "五.gif",
                strokes: 4,
                label: "五",
                todo: false,
                explanation: ""

            },
            {
                gif: "六.gif",
                strokes: 4,
                label: "六",
                todo: false,
                explanation: ""

            },

            {
                gif: "七.gif",
                strokes: 4,
                label: "七",
                todo: false,
                explanation: ""

            },
            {
                gif: "九.gif",
                strokes: 4,
                label: "九",
                todo: false,
                explanation: ""

            },
            {
                gif: "十.gif",
                strokes: 4,
                label: "十",
                todo: false,
                explanation: ""

            },
        ]
    },
    {
        id: 2,
        name: "basicos",
        difficult: "facil",
        data: [
            {
                gif: "口.gif",
                strokes: 3,
                label: "口",
                todo: false,
                explanation: ""

            },
            {
                gif: "日.gif",
                strokes: 4,
                label: "日",
                todo: false,
                explanation: ""

            },
            {
                gif: "月.gif",
                strokes: 4,
                label: "月",
                todo: false,
                explanation: ""

            },
            {
                gif: "田.gif",
                strokes: 5,
                label: "田",
                todo: false,
                explanation: ""

            },
            {
                gif: "目.gif",
                strokes: 5,
                label: "目",
                todo: false,
                explanation: ""

            },
        ]
    }
]

