import express from "express"
import API from "../types/api.js"
import manifest from "./info.js"
import axios from "axios"
import { DateTime } from "luxon"
import {
    ConnectionsUserData,
    CrosswordUserData,
    SpellingBeeUserData,
    WordleUserData,
} from "./gameData.js"

const router = express.Router()
const nytGames = new API(router, manifest)

const noThrowAxios = axios.create({
    validateStatus: () => true,
})

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

// #region CROSSWORD
type CrosswordReturnType =
    | {
          success: true
          data: CrosswordUserData
      }
    | {
          success: false
          error: string
          code?: number
          data?: unknown
      }

async function fetchCrosswordData(
    type: "midi" | "mini" | "daily",
    nytSCookie: string,
): Promise<CrosswordReturnType> {
    // the crossword APIs are now unified!
    const dateLow = DateTime.now().minus({ days: 7 }).toISO().split("T")[0]
    const dateHigh = DateTime.now().plus({ days: 7 }).toISO().split("T")[0]

    // get today's crossword
    const crossword = await noThrowAxios.get(
        `https://www.nytimes.com/svc/games/v1/archive/crossword_${type}/${dateLow}/${dateHigh}`,
        {
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        },
    )

    // get id and print date
    const results = crossword.data
    const puzzle = results?.[results.length - 1]
    const id = puzzle?.id
    const printDate = puzzle?.print_date

    if (crossword.status !== 200 || !id || !printDate) {
        return {
            success: false,
            error: `Could not fetch ${type} id`,
        }
    }

    // get user stats
    const stats = await noThrowAxios.get(
        `https://www.nytimes.com/svc/games/state/crossword_${type}/latests`,
        {
            params: { puzzle_ids: id },
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        },
    )

    const crosswordData = stats.data

    if (stats.status !== 200 || !crosswordData) {
        return {
            success: false,
            error: `Could not fetch ${type} stats`,
            code: stats.status,
            data: crosswordData,
        }
    }

    // create return data
    // has not been solved if there is no firstSolve field
    const userData: CrosswordUserData = crosswordData.states?.[0]?.game_data
        ?.firstSolve
        ? {
              id: id,
              date: printDate,
              solved: true,
              autocheck: crosswordData.states[0].game_data.firstSolveUsedAid,
              solveSeconds: crosswordData.states[0].game_data.firstSolve,
          }
        : {
              id: id,
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
type WordleReturnType =
    | {
          success: true
          data: WordleUserData
      }
    | {
          success: false
          error: string
          code?: number
          data?: unknown
      }

async function fetchWordleData(
    nytSCookie: string,
    dateString: string,
): Promise<WordleReturnType> {
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
        },
    )

    const wordleData = stats.data

    if (stats.status !== 200 || !wordleData) {
        return {
            success: false,
            error: "Could not fetch Wordle stats",
            code: stats.status,
            data: wordleData,
        }
    }

    // has not been solved if wordleData.states is undefined or wordleData.states[0].game_data.status !== "WIN" or "FAIL"

    const complete =
        wordleData.states &&
        (wordleData.states?.[0]?.game_data?.status === "WIN" ||
            wordleData.states?.[0]?.game_data?.status === "FAIL")
    const solved = wordleData.states?.[0]?.game_data?.status === "WIN"

    const userData: WordleUserData = complete
        ? {
              id: id,
              date: printDate,
              completed: true,
              solved: solved,
              hardMode: wordleData.states?.[0]?.game_data?.hardMode,
              guesses:
                  solved && wordleData.states?.[0]?.game_data?.currentRowIndex,
          }
        : {
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
type ConnectionsReturnType =
    | {
          success: true
          data: ConnectionsUserData
      }
    | {
          success: false
          error: string
          code?: number
          data?: unknown
      }

async function fetchConnectionsData(
    nytSCookie: string,
    dateString: string,
): Promise<ConnectionsReturnType> {
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
        },
    )

    const connectionsData = stats.data

    if (stats.status !== 200 || !connectionsData) {
        return {
            success: false,
            error: "Could not fetch Connections stats",
            code: stats.status,
            data: connectionsData,
        }
    }

    // has not been solved if connectionsData.states is undefined or connectionsData.states[0].game_data.puzzleComplete is false
    const complete =
        connectionsData.states &&
        connectionsData.states?.[0]?.game_data?.puzzleComplete

    const userData: ConnectionsUserData = complete
        ? {
              id: id,
              date: printDate,
              completed: true,
              won: connectionsData.states?.[0]?.game_data?.puzzleWon,
              categoriesSolved:
                  connectionsData.states?.[0]?.game_data?.solvedCategories
                      ?.length,
              mistakes: connectionsData.states?.[0]?.game_data?.mistakes,
          }
        : {
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
type SpellingBeeReturnType =
    | {
          success: true
          data: SpellingBeeUserData
      }
    | {
          success: false
          error: string
          code?: number
          data?: unknown
      }

async function fetchSpellingBeeData(
    nytSCookie: string,
): Promise<SpellingBeeReturnType> {
    // not sure where the API is for date -> id
    // but the html page itself has the data
    const spellingBeeHTML = await noThrowAxios.get(
        "https://www.nytimes.com/puzzles/spelling-bee",
        {
            headers: {
                Cookie: `NYT-S=${nytSCookie}`,
            },
        },
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
        },
    )

    const spellingBeeData = stats.data
    if (stats.status !== 200 || !spellingBeeData) {
        return {
            success: false,
            error: "Could not fetch Spelling Bee stats",
            code: stats.status,
            data: spellingBeeData,
        }
    }

    // spelling bee data can be empty
    const isNotEmpty = spellingBeeData.states[0]

    const userData: SpellingBeeUserData = isNotEmpty
        ? {
              id: id,
              date: printDate,
              empty: false,
              revealed: spellingBeeData.states?.[0]?.game_data?.isRevealed,
              rank: spellingBeeData.states?.[0]?.game_data?.rank,
              wordsFound:
                  spellingBeeData.states?.[0]?.game_data?.answers?.length,
          }
        : {
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

    type GenericReturnType<T> =
        | {
              success: true
              data: T
          }
        | {
              success: false
              error: string
          }

    const errorHandle = <T>(data: GenericReturnType<T>): T => {
        if (!data.success) {
            throw new Error(data.error, { cause: data })
        }
        return data.data
    }

    // fetch all game data
    try {
        const [
            crosswordData,
            midiData,
            miniData,
            wordleData,
            connectionsData,
            spellingBeeData,
        ] = await Promise.all([
            fetchCrosswordData("daily", nytSCookie).then(errorHandle),
            fetchCrosswordData("midi", nytSCookie).then(errorHandle),
            fetchCrosswordData("mini", nytSCookie).then(errorHandle),
            fetchWordleData(nytSCookie, dateString).then(errorHandle),
            fetchConnectionsData(nytSCookie, dateString).then(errorHandle),
            fetchSpellingBeeData(nytSCookie).then(errorHandle),
        ])

        res.json({
            crossword: crosswordData,
            midi: midiData,
            mini: miniData,
            wordle: wordleData,
            connections: connectionsData,
            spellingBee: spellingBeeData,
        })
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                error: e.message,
                cause: e.cause,
            })
        }
    }
})

// #endregion

export default nytGames
