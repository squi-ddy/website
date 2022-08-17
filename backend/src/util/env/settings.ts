class Settings {
    constructor(
        readonly DOMAIN: string,
        readonly PORT: number,
        readonly DATABASE_HOST: string,
        readonly DATABASE_PORT: number,
        readonly DATABASE_USER: string,
        readonly DATABASE_PASS: string,
        readonly STATIC_SITE_NAME: string,
        readonly STATIC_SITE_PROTOCOL: string,
        readonly OXFORD_API_ID: string,
        readonly OXFORD_API_KEY: string
    ) {
    }
}

const settings = new Settings(
    process.env.DOMAIN || "localhost",
    parseInt(String(process.env.PORT), 10) || 3000,
    process.env.DATABASE_HOST || "localhost",
    parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
    process.env.DATABASE_USER || "postgres",
    process.env.DATABASE_PASSWORD || "",
    process.env.STATIC_SITE_NAME || "localhost",
    process.env.STATIC_SITE_PROTOCOL || "http",
    process.env.OXFORD_API_ID || "",
    process.env.OXFORD_API_KEY || ""
)

export { settings }
