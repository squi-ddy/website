import express from "express"
import { getPool, handleQueryError } from "../../util/db/postgres"
import lcsWordChances from "./data/lcsWordChances"
import { indexLCS, normaliseChances, selectFromChances } from "./util/util"
import { getStaticUrl } from "../../util/static/static"
import axios from "axios"
import LCS from "./types/lcs"
import LCSMeaning from "./types/lcsMeaning"
import { getLocalDateTime } from "../../util/time/time"
import { DateTime, Duration } from "luxon"
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
            throw new Error(`Error generating LCS: Failed get on ${startsWith} txt file`)
        }
        const words = String(wordsResponse.data).split("\n")
        let word
        do {
            word = words[Math.floor(Math.random() * words.length)]
        } while (word.length === 0)
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
        .plus(Duration.fromObject({ days: 1, seconds: 15 }))
        .plus(rolloverOffset)

    return new LCSMeaning(meanings, time.toISODate(), id, checkNext.toISO())
}

async function getLCSByIndex(
    index: number
): Promise<LCSMeaning | null | undefined> {
    let result
    try {
        result = await pool.query(
            `
            SELECT
                l,
                c,
                s,
                sus,
                day
            FROM history
            WHERE id=$1
            `,
            [index]
        )
    } catch (e) {
        return null
    }

    if (result.rows.length === 0) {
        return undefined
    }

    const lcs = result.rows[0] as LCS
    const date: Date = result.rows[0].day

    const day = DateTime.fromJSDate(date).toISODate()

    const meanings = Array<Meaning>()
    for (let i = 0; i < 4; i++) {
        const word = indexLCS(lcs, i)

        meanings.push(new Meaning(word))
    }

    return new LCSMeaning(meanings, day, index)
}

lcsRouter.get("/", async (_req, res) => {
    const lcs = await getLCS()
    if (lcs === null) {
        handleQueryError(new Error("DB error"), res)
    } else {
        res.json(lcs)
    }
})

lcsRouter.get("/:id(\\d+)", async (req, res) => {
    const lcs = await getLCSByIndex(parseInt(req.params.id || "0"))
    if (lcs === undefined) {
        res.status(404).send("Invalid LCS id")
    } else if (lcs === null) {
        handleQueryError(new Error("DB error"), res)
    } else {
        res.json(lcs)
    }
})

export { lcsRouter }
