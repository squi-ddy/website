import express, { NextFunction, Request, Response } from "express"
import { getPool, handleQueryError } from "../../../db/postgres"
import { authenticate } from "../auth"
import { sha512 } from "js-sha512"
import bcrypt from "bcrypt"
import { QueryResult } from "pg"

const usersRouter = express.Router()
const pool = getPool("supervend")

async function checkName(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user != req.params.name) {
        res.status(401)
        res.send("Unauthorized")
        return
    }
    next()
}

async function modifyPassword(password: string, req: Request, res: Response) {
    const passwordHash = sha512(password)
    const passwordSaltedHash = await bcrypt.hash(passwordHash, await bcrypt.genSalt(12))
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
        res.status(404)
        res.send("User not found")
    }
}

async function depositMoney(amount: number, req: Request, res: Response) {
    let updateResult: QueryResult
    try {
        updateResult = await pool.query(
            "UPDATE users SET wallet = wallet + $2 WHERE name = $1",
            [req.params.name, amount]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (updateResult.rowCount < 1) {
        res.status(404)
        res.send("User not found")
    }
}

usersRouter.get("/:name",
    authenticate,
    checkName,
    async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT name, wallet FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rowCount < 1) {
                res.status(404)
                res.send("User not found")
                return
            }
            res.json(result.rows[0])
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

usersRouter.post("/:name",
    async (req, res) => {
        const name = req.params.name || ""
        const password: string = req.body.password.toString() || ""
        if (name.length > 30 || name == "" || password == "") {
            res.status(400)
            res.send("Invalid parameters")
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
            res.status(400)
            res.send("User already exists")
            return
        }
        const passwordHash = sha512(password)
        const passwordSaltedHash = await bcrypt.hash(passwordHash, await bcrypt.genSalt(12))
        let insertionResult: QueryResult
        try {
            insertionResult = await pool.query(
                "INSERT INTO users VALUES ($1, $2) RETURNING name, wallet",
                [name, passwordSaltedHash]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (insertionResult.rowCount < 1) {
            res.status(400)
            res.send("User already exists")
            return
        }
        res.json(insertionResult.rows[0])
    }
)

usersRouter.delete("/:name",
    authenticate,
    checkName,
    async (req, res) => {
        try {
            const result = await pool.query(
                "DELETE FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rowCount < 1) {
                res.status(404)
                res.send("User not found")
                return
            }
            res.sendStatus(204)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

usersRouter.patch("/:name",
    authenticate,
    checkName,
    async (req, res) => {
        const password: string = req.body.password.toString() || ""
        const deposit = req.body.deposit || 0
        const depositNumber = parseInt(deposit, 10)
        if (isNaN(depositNumber) || depositNumber < 0) {
            res.status(400)
            res.send("Invalid parameters")
            return
        }

        if (password != "" && res.locals.password != password) {
            // modify password
            await modifyPassword(password, req, res)
            if (res.writableEnded) return
        }

        if (depositNumber != 0) {
            // add value
            await depositMoney(depositNumber, req, res)
            if (res.writableEnded) return
        }

        let result: QueryResult
        try {
            result = await pool.query(
                "SELECT name, wallet FROM users WHERE name = $1",
                [req.params.name]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (result.rowCount < 1) {
            res.status(404)
            res.send("User not found")
            return
        }
        res.json(result.rows[0])
    }
)

export { usersRouter }