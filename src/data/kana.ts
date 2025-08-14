
export interface Kana {
    sound: string,
    gif: string,
    label: string,
    todo: boolean,
    strokes: number
}

export type KanaGrid = Kana | string


type KanaPractice = {
    [key: string]: string
}

export enum Modes {
    hiragana = 'hiragana',
    katakana = 'katakana'
}

export enum Variations {
    mainKana = 'mainKana',
    dakutenKana = 'dakutenKana',
    combinationKana = 'combinationKana'
}


export const HiraganaList: KanaPractice = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "wo",
    "ん": "n",
};

export const HiraganaDakutenList: KanaPractice = {
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
    "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
    "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
};

export const HiraganaCombinationList: KanaPractice = {
    "きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
    "しゃ": "sha", "しゅ": "shu", "しょ": "sho",
    "ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
    "にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
    "ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
    "みゃ": "mya", "みゅ": "myu", "みょ": "myo",
    "りゃ": "rya", "りゅ": "ryu", "りょ": "ryo"
}

export const KatakanaList = {
    "ア": "a", "イ": "i", "ウ": "u", "エ": "e", "オ": "o",
    "カ": "ka", "キ": "ki", "ク": "ku", "ケ": "ke", "コ": "ko",
    "サ": "sa", "シ": "shi", "ス": "su", "セ": "se", "ソ": "so",
    "タ": "ta", "チ": "chi", "ツ": "tsu", "テ": "te", "ト": "to",
    "ナ": "na", "ニ": "ni", "ヌ": "nu", "ネ": "ne", "ノ": "no",
    "ハ": "ha", "ヒ": "hi", "フ": "fu", "ヘ": "he", "ホ": "ho",
    "マ": "ma", "ミ": "mi", "ム": "mu", "メ": "me", "モ": "mo",
    "ヤ": "ya", "ユ": "yu", "ヨ": "yo",
    "ラ": "ra", "リ": "ri", "ル": "ru", "レ": "re", "ロ": "ro",
    "ワ": "wa", "ヲ": "wo",
    "ン": "n",
};

export const KatakanaDakutenList: KanaPractice = {
    "ガ": "ga", "ギ": "gi", "グ": "gu", "ゲ": "ge", "ゴ": "go",
    "ザ": "za", "ジ": "ji", "ズ": "zu", "ゼ": "ze", "ゾ": "zo",
    "ダ": "da", "ヂ": "di", "ヅ": "du", "デ": "de", "ド": "do",
    "バ": "ba", "ビ": "bi", "ブ": "bu", "ベ": "be", "ボ": "bo",
    "パ": "pa", "ピ": "pi", "プ": "pu", "ペ": "pe", "ポ": "po",
}

export const KatakanaCombinationList: KanaPractice = {
    "キャ": "kya", "キュ": "kyu", "キョ": "kyo",
    "シャ": "sha", "シュ": "shu", "ショ": "sho",
    "チャ": "cha", "チュ": "chu", "チョ": "cho",
    "ニャ": "nya", "ニュ": "nyu", "ニョ": "nyo",
    "ヒャ": "hya", "ヒュ": "hyu", "ヒョ": "hyo",
    "ミャ": "mya", "ミュ": "myu", "ミョ": "myo",
    "リャ": "rya", "リュ": "ryu", "リョ": "ryo"
}




export const hiragana: KanaGrid[][] = [
    ["", "a", "i", "u", "e", "o"],
    ["", { sound: "a.mp3", gif: "あ.gif", label: "あ", todo: false, strokes: 3 }, { sound: "i.mp3", gif: "い.gif", label: "い", todo: false, strokes: 2 }, { sound: "u.mp3", gif: "う.gif", label: "う", todo: false, strokes: 2 }, { sound: "e.mp3", gif: "え.gif", label: "え", todo: false, strokes: 2 }, { sound: "o.mp3", gif: "お.gif", label: "お", todo: false, strokes: 3 }],
    ["k", { sound: "ka.mp3", gif: "か.gif", label: "か", todo: false, strokes: 3 }, { sound: "ki.mp3", gif: "き.gif", label: "き", todo: false, strokes: 4 }, { sound: "ku.mp3", gif: "く.gif", label: "く", todo: false, strokes: 1 }, { sound: "ke.mp3", gif: "け.gif", label: "け", todo: false, strokes: 3 }, { sound: "ko.mp3", gif: "こ.gif", label: "こ", todo: false, strokes: 2 }],
    ["s", { sound: "sa.mp3", gif: "さ.gif", label: "さ", todo: false, strokes: 3 }, { sound: "shi.mp3", gif: "し.gif", label: "し", todo: false, strokes: 1 }, { sound: "su.mp3", gif: "す.gif", label: "す", todo: false, strokes: 2 }, { sound: "se.mp3", gif: "せ.gif", label: "せ", todo: false, strokes: 3 }, { sound: "so.mp3", gif: "そ.gif", label: "そ", todo: false, strokes: 1 }],
    ["t", { sound: "ta.mp3", gif: "た.gif", label: "た", todo: false, strokes: 4 }, { sound: "chi.mp3", gif: "ち.gif", label: "ち", todo: false, strokes: 2 }, { sound: "tsu.mp3", gif: "つ.gif", label: "つ", todo: false, strokes: 1 }, { sound: "te.mp3", gif: "て.gif", label: "て", todo: false, strokes: 1 }, { sound: "to.mp3", gif: "と.gif", label: "と", todo: false, strokes: 2 }],
    ["n", { sound: "na.mp3", gif: "な.gif", label: "な", todo: false, strokes: 4 }, { sound: "ni.mp3", gif: "に.gif", label: "に", todo: false, strokes: 3 }, { sound: "nu.mp3", gif: "ぬ.gif", label: "ぬ", todo: false, strokes: 2 }, { sound: "ne.mp3", gif: "ね.gif", label: "ね", todo: false, strokes: 2 }, { sound: "no.mp3", gif: "の.gif", label: "の", todo: false, strokes: 1 }],
    ["h", { sound: "ha.mp3", gif: "は.gif", label: "は", todo: false, strokes: 3 }, { sound: "hi.mp3", gif: "ひ.gif", label: "ひ", todo: false, strokes: 1 }, { sound: "fu.mp3", gif: "ふ.gif", label: "ふ", todo: false, strokes: 4 }, { sound: "he.mp3", gif: "へ.gif", label: "へ", todo: false, strokes: 1 }, { sound: "ho.mp3", gif: "ほ.gif", label: "ほ", todo: false, strokes: 4 }],
    ["m", { sound: "ma.mp3", gif: "ま.gif", label: "ま", todo: false, strokes: 3 }, { sound: "mi.mp3", gif: "み.gif", label: "み", todo: false, strokes: 2 }, { sound: "mu.mp3", gif: "む.gif", label: "む", todo: false, strokes: 3 }, { sound: "me.mp3", gif: "め.gif", label: "め", todo: false, strokes: 2 }, { sound: "mo.mp3", gif: "も.gif", label: "も", todo: false, strokes: 3 }],
    ["y", { sound: "ya.mp3", gif: "や.gif", label: "や", todo: false, strokes: 3 }, "", { sound: "yu.mp3", gif: "ゆ.gif", label: "ゆ", todo: false, strokes: 2 }, "", { sound: "yo.mp3", gif: "よ.gif", label: "よ", todo: false, strokes: 2 }],
    ["r", { sound: "ra.mp3", gif: "ら.gif", label: "ら", todo: false, strokes: 2 }, { sound: "ri.mp3", gif: "り.gif", label: "り", todo: false, strokes: 2 }, { sound: "ru.mp3", gif: "る.gif", label: "る", todo: false, strokes: 1 }, { sound: "re.mp3", gif: "れ.gif", label: "れ", todo: false, strokes: 2 }, { sound: "ro.mp3", gif: "ろ.gif", label: "ろ", todo: false, strokes: 1 }],
    ["w", { sound: "wa.mp3", gif: "わ.gif", label: "わ", todo: false, strokes: 2 }, "", { sound: "n.mp3", gif: "ん.gif", label: "ん", todo: false, strokes: 1 }, "", { sound: "wo.mp3", gif: "を.gif", label: "を", todo: false, strokes: 3 }],
];

export const katakana: KanaGrid[][] = [
    ["", "a", "i", "u", "e", "o"],
    ["", { sound: "a.mp3", gif: "ア.gif", label: "ア", todo: false, strokes: 2 }, { sound: "i.mp3", gif: "イ.gif", label: "イ", todo: false, strokes: 2 }, { sound: "u.mp3", gif: "ウ.gif", label: "ウ", todo: false, strokes: 3 }, { sound: "e.mp3", gif: "エ.gif", label: "エ", todo: false, strokes: 3 }, { sound: "o.mp3", gif: "オ.gif", label: "オ", todo: false, strokes: 3 }],
    ["k", { sound: "ka.mp3", gif: "カ.gif", label: "カ", todo: false, strokes: 2 }, { sound: "ki.mp3", gif: "キ.gif", label: "キ", todo: false, strokes: 3 }, { sound: "ku.mp3", gif: "ク.gif", label: "ク", todo: false, strokes: 2 }, { sound: "ke.mp3", gif: "ケ.gif", label: "ケ", todo: false, strokes: 3 }, { sound: "ko.mp3", gif: "コ.gif", label: "コ", todo: false, strokes: 2 }],
    ["s", { sound: "sa.mp3", gif: "サ.gif", label: "サ", todo: false, strokes: 3 }, { sound: "shi.mp3", gif: "シ.gif", label: "シ", todo: false, strokes: 3 }, { sound: "su.mp3", gif: "ス.gif", label: "ス", todo: false, strokes: 2 }, { sound: "se.mp3", gif: "セ.gif", label: "セ", todo: false, strokes: 2 }, { sound: "so.mp3", gif: "ソ.gif", label: "ソ", todo: false, strokes: 2 }],
    ["t", { sound: "ta.mp3", gif: "タ.gif", label: "タ", todo: false, strokes: 3 }, { sound: "chi.mp3", gif: "チ.gif", label: "チ", todo: false, strokes: 3 }, { sound: "tsu.mp3", gif: "ツ.gif", label: "ツ", todo: false, strokes: 3 }, { sound: "te.mp3", gif: "テ.gif", label: "テ", todo: false, strokes: 3 }, { sound: "to.mp3", gif: "ト.gif", label: "ト", todo: false, strokes: 2 }],
    ["n", { sound: "na.mp3", gif: "ナ.gif", label: "ナ", todo: false, strokes: 2 }, { sound: "ni.mp3", gif: "ニ.gif", label: "ニ", todo: false, strokes: 2 }, { sound: "nu.mp3", gif: "ヌ.gif", label: "ヌ", todo: false, strokes: 2 }, { sound: "ne.mp3", gif: "ネ.gif", label: "ネ", todo: false, strokes: 4 }, { sound: "no.mp3", gif: "ノ.gif", label: "ノ", todo: false, strokes: 1 }],
    ["h", { sound: "ha.mp3", gif: "ハ.gif", label: "ハ", todo: false, strokes: 2 }, { sound: "hi.mp3", gif: "ヒ.gif", label: "ヒ", todo: false, strokes: 2 }, { sound: "fu.mp3", gif: "フ.gif", label: "フ", todo: false, strokes: 1 }, { sound: "he.mp3", gif: "ヘ.gif", label: "ヘ", todo: false, strokes: 1 }, { sound: "ho.mp3", gif: "ホ.gif", label: "ホ", todo: false, strokes: 4 }],
    ["m", { sound: "ma.mp3", gif: "マ.gif", label: "マ", todo: false, strokes: 2 }, { sound: "mi.mp3", gif: "ミ.gif", label: "ミ", todo: false, strokes: 3 }, { sound: "mu.mp3", gif: "ム.gif", label: "ム", todo: false, strokes: 2 }, { sound: "me.mp3", gif: "メ.gif", label: "メ", todo: false, strokes: 2 }, { sound: "mo.mp3", gif: "モ.gif", label: "モ", todo: false, strokes: 3 }],
    ["y", { sound: "ya.mp3", gif: "ヤ.gif", label: "ヤ", todo: false, strokes: 2 }, "", { sound: "yu.mp3", gif: "ユ.gif", label: "ユ", todo: false, strokes: 2 }, "", { sound: "yo.mp3", gif: "ヨ.gif", label: "ヨ", todo: false, strokes: 3 }],
    ["r", { sound: "ra.mp3", gif: "ラ.gif", label: "ラ", todo: false, strokes: 2 }, { sound: "ri.mp3", gif: "リ.gif", label: "リ", todo: false, strokes: 2 }, { sound: "ru.mp3", gif: "ル.gif", label: "ル", todo: false, strokes: 2 }, { sound: "re.mp3", gif: "レ.gif", label: "レ", todo: false, strokes: 1 }, { sound: "ro.mp3", gif: "ロ.gif", label: "ロ", todo: false, strokes: 3 }],
    ["w", { sound: "wa.mp3", gif: "ワ.gif", label: "ワ", todo: false, strokes: 2 }, "", { sound: "n.mp3", gif: "ン.gif", label: "ン", todo: false, strokes: 2 }, "", { sound: "wo.mp3", gif: "ヲ.gif", label: "ヲ", todo: false, strokes: 3 }],
];