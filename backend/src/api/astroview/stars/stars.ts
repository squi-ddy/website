import express from "express"
import Time from "../types/time"
import { getPool, handleQueryError } from "../../../db/postgres"
import { authenticate } from "../auth"
import StarReview from "../types/starReview"

const starRouter = express.Router()
const pool = getPool("astroview")

starRouter.get("/:starNum/ratings",
    async (req, res): Promise<void> => {
        const starNumber = parseInt(req.params.starNum, 10)
        if (isNaN(starNumber) || starNumber <= 0) {
            res.status(400).send("Invalid star number")
            return
        }
        try {
            const result = await pool.query(
                `
                SELECT
                    id,
                    star,
                    name,
                    content,
                    time
                FROM star_ratings
                WHERE star = $1
                `,
                [starNumber]
            )
            result.rows.forEach((value, index) => {
                result.rows[index] = new StarReview(
                    value.id,
                    value.name,
                    value.content,
                    new Time(value.time),
                    value.star
                )
            })
            res.json(result.rows)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

starRouter.post("/:starNum/ratings",
    authenticate,
    async (req, res): Promise<void> => {
        const starNumber = parseInt(req.params.starNum, 10)
        const content = String(req.body.content || "")
        const name: string = res.locals.user
        if (isNaN(starNumber) || starNumber <= 0 || content === "") {
            res.status(400).send("Invalid parameters")
            return
        }

        const time = new Date()

        try {
            const result = await pool.query(
                "INSERT INTO star_ratings(name, content, time, star) VALUES ($1, $2, $3, $4) RETURNING id",
                [name, content, time, starNumber]
            )
            if (result.rows.length) {
                res.json(
                    new StarReview(
                        result.rows[0].id,
                        name,
                        content,
                        new Time(time),
                        starNumber
                    )
                )
            } else {
                res.status(400).send("Invalid parameters")
            }
        } catch (err) {
            handleQueryError(err, res)
        }

    }
)

export { starRouter }