import dotenv from 'dotenv'

dotenv.config()

class Settings {
    domain: string;
    port: number;
    database_user: string;
    database_password: string;
    database_host: string;
    database_port: number;
}

const settings = new Settings()

settings.domain = process.env.DOMAIN || 'localhost'
settings.port = parseInt(process.env.PORT) || 3000
settings.database_host = process.env.DATABASE_HOST || 'localhost'
settings.database_port = parseInt(process.env.DATABASE_PORT) || 5432
settings.database_user = process.env.DATABASE_USER || 'postgres'
settings.database_password = process.env.DATABASE_PASSWORD || ''

export { settings }