import express from "express"
import API from "../types/api"
import manifest from "./info"
import axios, { AxiosResponse } from "axios"
import { DateTime } from "luxon"
import { ConnectionsUserData, CrosswordUserData, SpellingBeeUserData, WordleUserData } from "./gameData"

const router = express.Router()
const nytGames = new API(router, manifest)

const noThrowAxios = axios.create({
    validateStatus: () => true
})

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

// #region CROSSWORD

type CrosswordReturnType = {
    success: true
    data: CrosswordUserData
} | {
    success: false
    error: string
}

async function fetchCrosswordData(nytSCookie: string): Promise<CrosswordReturnType> {
    // get today's crossword
    const crossword = await noThrowAxios.get(
        "https://www.nytimes.com/svc/crosswords/v3/208105897/puzzles.json",
        {
            params: {
                publish_type: "daily",
                limit: 1
            },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    // get id and print date
    const id = crossword.data?.results?.[0]?.puzzle_id
    const printDate = crossword.data?.results[0]?.print_date

    if (crossword.status !== 200 || !id || !printDate) {
        return {
            success: false,
            error: "Could not fetch crossword id",
        }
    }

    // get user stats
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/crosswords/v6/game/${id}.json`,
        {
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const crosswordData = stats.data

    if (stats.status !== 200 || !crosswordData) {
        return {
            success: false,
            error: "Could not fetch crossword stats",
        }
    }

    // create return data
    // has not been solved if crosswordData.calcs is empty (i.e. crosswordData.calcs.solved does not exist)
    const userData: CrosswordUserData = crosswordData.calcs?.solved ? {
        id: crosswordData.puzzleID,
        date: printDate,
        solved: crosswordData.calcs?.solved,
        autocheck: crosswordData.autocheckEnabled,
        solveSeconds: crosswordData.calcs?.secondsSpentSolving,
    } : {
        id: crosswordData.puzzleID,
        date: printDate,
        solved: false,
    }

    return {
        success: true,
        data: userData,
    }
}

// #endregion

// #region MINI
async function fetchMiniData(nytSCookie: string): Promise<CrosswordReturnType> {
    // get today's mini
    const mini = await noThrowAxios.get(
        "https://www.nytimes.com/svc/crosswords/v3/208105897/puzzles.json",
        {
            params: {
                publish_type: "mini",
                limit: 1
            },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    // get id and print date
    const id = mini.data?.results?.[0]?.puzzle_id
    const printDate = mini.data?.results?.[0]?.print_date

    if (mini.status !== 200 || !id || !printDate) {
        return {
            success: false,
            error: "Could not fetch crossword id",
        }
    }

    // get user stats
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/crosswords/v6/game/${id}.json`,
        {
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const miniData = stats.data

    if (stats.status !== 200 || !miniData) {
        return {
            success: false,
            error: "Could not fetch crossword stats",
        }
    }

    // create return data
    // has not been solved if miniData.calcs is empty (i.e. miniData.calcs.solved does not exist)
    const userData: CrosswordUserData = miniData.calcs?.solved ? {
        id: miniData.puzzleID,
        date: printDate,
        autocheck: miniData.autocheckEnabled,
        solved: miniData.calcs?.solved,
        solveSeconds: miniData.calcs?.secondsSpentSolving,
    } : {
        id: miniData.puzzleID,
        date: printDate,
        solved: false,
    }

    return {
        success: true,
        data: userData,
    }
}
// #endregion

// #region WORDLE

type WordleReturnType = {
    success: true
    data: WordleUserData
} | {
    success: false
    error: string
}

async function fetchWordleData(nytSCookie: string, dateString: string): Promise<WordleReturnType> {
    // get today's wordle
    // wordle uses the date in your local timezone
    const wordle = await noThrowAxios.get(
        `https://www.nytimes.com/svc/wordle/v2/${dateString}.json`,
    )

    const id = wordle.data?.id
    const printDate = wordle.data?.print_date

    if (wordle.status !== 200 || !id || !printDate) {
        return {
            success: false,
            error: "Could not fetch Wordle id",
        }
    }

    // get user stats
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/games/state/wordleV2/latests`,
        {
            params: {
                puzzle_ids: id,
            },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const wordleData = stats.data

    if (stats.status !== 200 || !wordleData) {
        return {
            success: false,
            error: "Could not fetch Wordle stats",
        }
    }

    // has not been solved if wordleData.states is undefined or wordleData.states[0].game_data.status !== "WIN" or "FAIL"

    const complete = wordleData.states && (wordleData.states?.[0]?.game_data?.status === "WIN" || wordleData.states?.[0]?.game_data?.status === "FAIL")
    const solved = wordleData.states?.[0]?.game_data?.status === "WIN"
    
    const userData: WordleUserData = complete ? {
        id: id,
        date: printDate,
        completed: true,
        solved: solved,
        hardMode: wordleData.states?.[0]?.game_data?.hardMode,
        guesses: solved && wordleData.states?.[0]?.game_data?.currentRowIndex,
    } : {
        id: id,
        date: printDate,
        completed: false,
    }

    return {
        success: true,
        data: userData,
    }
}

// #endregion

// #region CONNECTIONS
type ConnectionsReturnType = {
    success: true
    data: ConnectionsUserData
} | {
    success: false
    error: string
}

async function fetchConnectionsData(nytSCookie: string, dateString: string): Promise<ConnectionsReturnType> {
    // get today's connections
    // connections uses the date in your local timezone
    const connections = await noThrowAxios.get(
        `https://www.nytimes.com/svc/connections/v2/${dateString}.json`,
    )

    const id = connections.data?.id
    const printDate = connections.data?.print_date

    if (connections.status !== 200 || !id || !printDate) {
        return {
            success: false,
            error: "Could not fetch Connections id",
        }
    }

    // get user stats
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/games/state/connections/latests`,
        {
            params: {
                puzzle_ids: id,
            },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const connectionsData = stats.data

    if (stats.status !== 200 || !connectionsData) {
        return {
            success: false,
            error: "Could not fetch Connections stats",
        }
    }

    // has not been solved if connectionsData.states is undefined or connectionsData.states[0].game_data.puzzleComplete is false
    const complete = connectionsData.states && connectionsData.states?.[0]?.game_data?.puzzleComplete
    
    const userData: ConnectionsUserData = complete ? {
        id: id,
        date: printDate,
        completed: true,
        won: connectionsData.states?.[0]?.game_data?.puzzleWon,
        categoriesSolved: connectionsData.states?.[0]?.game_data?.solvedCategories?.length,
        mistakes: connectionsData.states?.[0]?.game_data?.mistakes,
    } : {
        id: id,
        date: printDate,
        completed: false,
    }

    return {
        success: true,
        data: userData,
    }
}
// #endregion

// #region SPELLING BEE
type SpellingBeeReturnType = {
    success: true
    data: SpellingBeeUserData
} | {
    success: false
    error: string
}

async function fetchSpellingBeeData(nytSCookie: string): Promise<SpellingBeeReturnType> {
    // not sure where the API is for date -> id
    // but the html page itself has the data
    const spellingBeeHTML = await noThrowAxios.get(
        "https://www.nytimes.com/puzzles/spelling-bee",
        {
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const html = spellingBeeHTML.data

    if (spellingBeeHTML.status !== 200 || !html) {
        return {
            success: false,
            error: "Could not fetch Spelling Bee data",
        }
    }

    const data = html.match(/>window\.gameData = (.+?)</)?.[1]
    if (!data) {
        return {
            success: false,
            error: "Could not parse Spelling Bee data",
        }
    }

    const parsedData = JSON.parse(data)
    const id = parsedData?.today?.id
    const printDate = parsedData?.today?.printDate

    if (!id || !printDate) {
        return {
            success: false,
            error: "Could not parse Spelling Bee id",
        }
    }

    // fetch spelling bee user data
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/games/state/spelling_bee/latests`,
        {
            params: {
                puzzle_ids: id,
            },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        }
    )

    const spellingBeeData = stats.data
    if (stats.status !== 200 || !spellingBeeData) {
        return {
            success: false,
            error: "Could not fetch Spelling Bee stats",
        }
    }

    // spelling bee data can be empty
    const isNotEmpty = spellingBeeData.states[0]

    const userData: SpellingBeeUserData = isNotEmpty ? {
        id: id,
        date: printDate,
        empty: false,
        revealed: spellingBeeData.states?.[0]?.game_data?.isRevealed,
        rank: spellingBeeData.states?.[0]?.game_data?.rank,
        wordsFound: spellingBeeData.states?.[0]?.game_data?.answers?.length,
    } : {
        id: id,
        date: printDate,
        empty: true,
    }

    return {
        success: true,
        data: userData,
    }
}

// #endregion

// #region ROUTES

router.get("/dailies", async (req, res) => {
    const nytSCookie = req.query?.nyt_s_cookie
    if (!nytSCookie || typeof nytSCookie !== "string") {
        res.status(400).json({
            error: "Provide a NYT Subscription cookie",
        })
        return
    }

    // get the current date, for date based games
    const date = DateTime.now()
    const dateString = date.toISO().split("T")[0]

    type GenericReturnType<T> = {
        success: true,
        data: T
    } | {
        success: false,
        error: string
    }

    const errorHandle = <T>(data: GenericReturnType<T>): T => {
        if (!data.success) {
            throw new Error(data.error)
        }
        return data.data
    }

    // fetch all game data
    try {
        const [crosswordData, miniData, wordleData, connectionsData, spellingBeeData] = await Promise.all([
            fetchCrosswordData(nytSCookie).then(errorHandle),
            fetchMiniData(nytSCookie).then(errorHandle),
            fetchWordleData(nytSCookie, dateString).then(errorHandle),
            fetchConnectionsData(nytSCookie, dateString).then(errorHandle),
            fetchSpellingBeeData(nytSCookie).then(errorHandle),
        ])

        res.json({
            crossword: crosswordData,
            mini: miniData,
            wordle: wordleData,
            connections: connectionsData,
            spellingBee: spellingBeeData,
        })
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                error: e.message,
            })
        }
    }
    
})

// #endregion

export default nytGames