import express from "express"
import { getPool, handleQueryError } from "../../util/db/postgres"
import lcsWordChances from "./data/lcsWordChances"
import { indexLCS, normaliseChances, selectFromChances } from "./util/util"
import { getStaticUrl } from "../../util/static/static"
import axios from "axios"
import LCS from "./types/lcs"
import LCSMeaning from "./types/lcsMeaning"
import { getLocalDateTime } from "../../util/time/time"
import { Duration } from "luxon"
import Meaning from "./types/meaning"

const lcsRouter = express.Router()
const pool = getPool("lcs")
const rolloverOffset = Duration.fromObject({ hours: 6, minutes: 0 })
const wordChances = normaliseChances(lcsWordChances)

async function generateLCS(): Promise<LCS> {
    const chosenWords = Array<string>()
    for (const chanceArray of wordChances.chancesArray) {
        const startsWith = selectFromChances(chanceArray)
        let wordsResponse
        try {
            wordsResponse = await axios.get(
                getStaticUrl("lcs", [`${startsWith}.txt`])
            )
        } catch (e) {
            throw new Error("Error generating LCS: Failed get on txt file")
        }
        const words = String(wordsResponse.data).split("\n")
        let word
        do {
            word = words[Math.floor(Math.random() * words.length)]
        } while (word.length != 0)
        chosenWords.push(word)
    }

    return new LCS(chosenWords)
}

async function getLCS(): Promise<LCSMeaning | null> {
    const time = getLocalDateTime().minus(rolloverOffset)
    const date = time.toSQLDate()

    // Check if we already generated today's LCS
    let result
    try {
        result = await pool.query(
            `
            SELECT
                l,
                c,
                s,
                sus,
                id
            FROM history
            WHERE day=$1
            `,
            [date]
        )
    } catch (e) {
        return null
    }

    let lcs: LCS
    let id: number
    if (result.rows.length > 0) {
        lcs = result.rows[0] as LCS
        id = result.rows[0].id
    } else {
        lcs = await generateLCS()
        try {
            const insertResult = await pool.query(
                `INSERT INTO history(day, l, c, s, sus) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [date, lcs.l, lcs.c, lcs.s, lcs.sus]
            )
            if (insertResult.rows.length === 0) return null
            id = insertResult.rows[0].id
        } catch (e) {
            return null
        }
    }

    // get meanings
    const meanings = Array<Meaning>()
    for (let i = 0; i < 4; i++) {
        const word = indexLCS(lcs, i)

        meanings.push(new Meaning(word))
    }

    const checkNext = time
        .startOf("day")
        .plus(Duration.fromObject({ days: 1, minutes: 2 }))
        .plus(rolloverOffset)

    return new LCSMeaning(meanings, time.toISODate(), id, checkNext.toISO())
}

lcsRouter.get("/", async (_req, res) => {
    const lcs = await getLCS()
    if (lcs === null) {
        handleQueryError(new Error("DB error"), res)
    } else {
        delete (lcs as { sus?: Meaning }).sus
        res.json(lcs)
    }
})

lcsRouter.get("/us", async (_req, res) => {
    const lcs = await getLCS()
    if (lcs === null) {
        handleQueryError(new Error("DB error"), res)
    } else {
        delete (lcs as { s?: Meaning }).s
        res.json(lcs)
    }
})

export { lcsRouter }
