import { NextFunction, Request, Response } from "express"
import { getPool } from "../../db/postgres"
import { sha256 } from "js-sha256"
import bcrypt from "bcrypt"

const pool = getPool("supervend")

async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authorisation = req.headers.authorization
    const params = authorisation.split(" ")
    if (params.length != 2 || params[0] != "Basic") {
        res.status(401)
        res.send("Unauthorised")
    }
    try {
        const decoded = Buffer.from(params[1], 'base64').toString()
        const [username, password] = decoded.split(":")
        if (username == null || password == null) {
            res.status(401)
            res.send("Unauthorised")
            return
        }
        const result = await pool.query(
            "SELECT hash FROM users WHERE name=$1",
            [username]
        )
        if (result.rowCount == 0) {
            res.status(401)
            res.send("Unauthorised")
            return
        }
        const hash = result.rows[0].hash
        const pwhash = sha256(password)
        const valid = await bcrypt.compare(pwhash, hash)
        if (valid) {
            next()
        } else {
            res.status(401)
            res.send("Unauthorised")
        }
    } catch (err) {
        res.status(401)
        res.send("Unauthorised")
    }
}

export { authenticate }