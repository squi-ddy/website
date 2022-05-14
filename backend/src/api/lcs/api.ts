import express from "express"
import { getPool } from "../../util/db/postgres"
import LCSChances from "./types/lcsChances"
import lcsWordChances from "./data/lcsWordChances"
import { indexChances } from "./util/chances"

const lcsRouter = express.Router()
const pool = getPool("lcs")
const rolloverHour = 6 // The daily LCS will update at 6am
const wordChances = normaliseChances(lcsWordChances)

function normaliseChances(chances: LCSChances): LCSChances {
    for (let i = 0; i < 4; i++) {
        let sum = 0
        const startChances = indexChances(chances, i)

        startChances.forEach((value) => {
            sum += value.weight
        })
        startChances.forEach((value) => {
            value.weight /= sum
        })
    }

    return chances
}

async function generateLCS()/* : Promise<LCS> */ {
    // TODO: generate LCS
}

lcsRouter.use("/",
    async (req, res) => {
        // TODO: api functions
    }
)

export { lcsRouter }