import { getPool, handleQueryError } from "../../../db/postgres"
import express from "express"

const categoryRouter = express.Router()
const pool = getPool("supervend")

categoryRouter.get("/",
    async (_req, res): Promise<void> => {
        try {
            const result = await pool.query(
                `
                SELECT
                    short_name,
                    full_name
                FROM categories
                `)
            res.json(result.rows)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

export { categoryRouter }