import pg from "pg"
import { settings } from "../env/settings"
import { Response } from "express"

const pools = new Map<string, pg.Pool>()

function getPool(database: string): pg.Pool {
    const currentPool = pools.get(database)
    if (currentPool !== undefined) {
        return currentPool
    }
    const pool = new pg.Pool({
        user: settings.DATABASE_USER,
        host: settings.DATABASE_HOST,
        database: database,
        password: settings.DATABASE_PASS,
        port: settings.DATABASE_PORT,
    })
    pools.set(database, pool)
    return pool
}

function handleQueryError(err: unknown, res: Response): void {
    console.error(err)
    res.status(500).send("Error connecting to database.")
}

export { getPool, handleQueryError }
