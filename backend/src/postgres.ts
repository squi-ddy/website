import { Pool } from 'pg'
import {settings} from "./settings";

const pools = new Map<string, Pool>()

function getPool(database: string): Pool {
    if (pools.has(database)) return pools.get(database)
    let pool = new Pool({
        user: settings.database_user,
        host: settings.database_host,
        database: database,
        password: settings.database_password,
        port: settings.database_port
    })
    pools.set(database, pool)
    return pool
}

export { getPool }