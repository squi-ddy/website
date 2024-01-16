import { NextFunction, Request, Response } from "express"
import { getPool, handleQueryError } from "../../../util/db/postgres"
import bcrypt from "bcrypt"
import { sha512 } from "js-sha512"
import { QueryResult } from "pg"

const pool = getPool("supervend")

async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const authorisation = req.headers.authorization || ""
    const params = authorisation.split(" ")
    if (params.length != 2 || params[0] != "Basic") {
        res.status(401).send("Unauthorised")
        return
    }
    let username: string
    let password: string
    try {
        const decoded = Buffer.from(params[1], "base64").toString()
        ;[username, password] = decoded.split(":")
        if (username === null || password === null) {
            res.status(401).send("Unauthorised")
            return
        }
    } catch (err) {
        res.status(401).send("Unauthorised")
        return
    }
    let result: QueryResult
    try {
        result = await pool.query("SELECT hash FROM users WHERE name=$1", [
            username,
        ])
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (!result.rowCount) {
        res.status(400).send("User not found")
        return
    }
    const hash = result.rows[0].hash
    const password_hash = sha512(password)
    const valid = await bcrypt.compare(password_hash, hash)
    if (valid) {
        res.locals.user = username
        res.locals.password = password
        next()
    } else {
        res.status(401).send("Unauthorised")
    }
}

async function genSaltedHash(password: string): Promise<string> {
    const passwordHash = sha512(password)
    return bcrypt.hash(passwordHash, await bcrypt.genSalt(12))
}

async function checkName(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user !== req.params.name) {
        res.status(401).send("Unauthorized")
        return
    }
    next()
}

export { authenticate, genSaltedHash, checkName }
