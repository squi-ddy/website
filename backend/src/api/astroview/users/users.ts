import express, { Request, Response } from "express"
import { getPool, handleQueryError } from "../../../util/db/postgres"
import { authenticate, checkName, genSaltedHash } from "../auth"
import { QueryResult } from "pg"

const userRouter = express.Router()
const pool = getPool("astroview")

userRouter.get("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        try {
            const result = await pool.query(
                "SELECT name FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rows.length < 1) {
                res.status(404).send("User not found")
                return
            }
            res.json(result.rows[0])
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

userRouter.post("/:name",
    async (req, res): Promise<void> => {
        const name = req.params.name || ""
        const password = String(req.body.password || "")
        if (name.length > 30 || name == "" || password == "") {
            res.status(400).send("Invalid parameters")
            return
        }
        let result: QueryResult
        try {
            result = await pool.query(
                "SELECT name FROM users WHERE name=$1",
                [name]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (result.rowCount > 0) {
            res.status(400).send("User already exists")
            return
        }
        const passwordSaltedHash = await genSaltedHash(password)
        let insertionResult: QueryResult
        try {
            insertionResult = await pool.query(
                "INSERT INTO users VALUES ($1, $2) RETURNING name",
                [name, passwordSaltedHash]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (insertionResult.rows.length < 1) {
            res.status(400).send("User already exists")
            return
        }
        res.json(insertionResult.rows[0])
    }
)

userRouter.delete("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        try {
            const result = await pool.query(
                "DELETE FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rowCount < 1) {
                res.status(404).send("User not found")
                return
            }
            res.sendStatus(204)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

userRouter.patch("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        const password = String(req.body.password || "")
        if (password === "") {
            res.status(400).send("Invalid password")
            return
        }

        // modify password
        await modifyPassword(password, req, res)
        if (res.writableEnded) return

        res.json({name: req.params.name})
    }
)

async function modifyPassword(password: string, req: Request, res: Response): Promise<void> {
    const passwordSaltedHash = await genSaltedHash(password)
    let updateResult: QueryResult
    try {
        updateResult = await pool.query(
            "UPDATE users SET hash = $2 WHERE name = $1",
            [req.params.name, passwordSaltedHash]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (updateResult.rowCount < 1) {
        res.status(404).send("User not found")
    }
}

export { userRouter }