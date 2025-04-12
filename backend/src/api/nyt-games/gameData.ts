export type CrosswordUserData = {
    id: number
    date: string
    solved: boolean
    autocheck?: boolean
    solveSeconds?: number
}

export type WordleUserData = {
    id: number
    date: string
    completed: boolean
    solved?: boolean
    hardMode?: boolean
    guesses?: number
}

export type ConnectionsUserData = {
    id: number
    date: string
    completed: boolean
    won?: boolean
    categoriesSolved?: number
    mistakes?: number
}

export type SpellingBeeUserData = {
    id: number
    date: string
    empty: boolean
    revealed?: boolean
    rank?: string
    wordsFound?: number
}