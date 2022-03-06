import { Pool } from "pg"
import { settings } from "../env/settings"
import { Response } from "express"

const pools = new Map<string, Pool>()

function getPool(database: string): Pool {
    if (pools.has(database)) return pools.get(database)
    const pool = new Pool({
        user: settings.database_user,
        host: settings.database_host,
        database: database,
        password: settings.database_password,
        port: settings.database_port
    })
    pools.set(database, pool)
    return pool
}

function handleQueryError(err: Error, res: Response) {
    console.error(err)
    res.status(500)
    res.send("Error connecting to database.")
}

export { getPool, handleQueryError }