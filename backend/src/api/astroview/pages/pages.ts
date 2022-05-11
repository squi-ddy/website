import express from "express"
import Time from "../types/time"
import { getPool, handleQueryError } from "../../../db/postgres"
import { authenticate } from "../auth"
import PageReview from "../types/pageReview"
import Page from "../types/page"
import { settings } from "../../../env/settings"

const pageRouter = express.Router()
const pool = getPool("astroview")

pageRouter.get("/",
    async (_req, res): Promise<void> => {
        const pages = new Map<string, unknown[]>()
        try {
            const result = await pool.query(
                `
                SELECT
                    id,
                    name,
                    file_name,
                    category
                FROM pages
                `)
            for (const row of result.rows) {
                if (!pages.has(row.category)) {
                    pages.set(row.category, [])
                }
                const pagesInCategory = pages.get(row.category)
                if (pagesInCategory === undefined) {
                    res.sendStatus(500)
                    return
                }
                pagesInCategory.push(
                    new Page(
                        row.id,
                        row.name,
                        row.file_name,
                        row.category
                    )
                )
            }
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

pageRouter.get("number/:pageNum",
    async (req, res): Promise<void> => {
        const pageNumber = parseInt(req.params.pageNum, 10)
        if (isNaN(pageNumber) || pageNumber <= 0) {
            res.status(400).send("Invalid page number")
            return
        }
        try {
            const result = await pool.query(
                "SELECT id, name, file_name, category FROM pages WHERE id = $1",
                [pageNumber]
            )
            result.rows.forEach((value, index) => {
                result.rows[index] = new Page(
                    value.id,
                    value.name,
                    value.file_name,
                    value.category
                )
            })
            res.json(result.rows)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

pageRouter.get("number/:pageNum/link",
    async (req, res): Promise<void> => {
        const pageNumber = parseInt(req.params.pageNum, 10)
        if (isNaN(pageNumber) || pageNumber <= 0) {
            res.status(400).send("Invalid page number")
            return
        }
        try {
            const result = await pool.query(
                "SELECT file_name FROM pages WHERE id = $1",
                [pageNumber]
            )
            if (result.rows) {
                res.redirect(`${settings.STATIC_SITE_PROTOCOL}://${settings.STATIC_SITE_NAME}/astroview/pages/${result.rows[0].file_name}`)
            }
            res.status(404).send("Page not found")
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

pageRouter.get(":pageNum/ratings",
    async (req, res): Promise<void> => {
        const pageNumber = parseInt(req.params.pageNum, 10)
        if (isNaN(pageNumber) || pageNumber <= 0) {
            res.status(400).send("Invalid page number")
            return
        }
        try {
            const result = await pool.query(
                `
                SELECT
                    id,
                    page,
                    name,
                    content,
                    time
                FROM page_ratings
                WHERE page = $1
                `,
                [pageNumber]
            )
            result.rows.forEach((value, index) => {
                result.rows[index] = new PageReview(
                    value.id,
                    value.name,
                    value.content,
                    new Time(value.time),
                    value.page
                )
            })
            res.json(result.rows)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

pageRouter.post(":pageNum/ratings",
    authenticate,
    async (req, res): Promise<void> => {
        const pageNumber = parseInt(req.params.pageNum, 10)
        const content = String(req.body.content || "")
        const name: string = res.locals.user
        if (isNaN(pageNumber) || pageNumber <= 0 || content === "") {
            res.status(400).send("Invalid parameters")
            return
        }

        const time = new Date()

        try {
            const result = await pool.query(
                "INSERT INTO page_ratings(name, content, time, page) VALUES ($1, $2, $3, $4) RETURNING id",
                [name, content, time, pageNumber]
            )
            if (result.rows.length) {
                res.json(
                    new PageReview(
                        result.rows[0].id,
                        name,
                        content,
                        new Time(time),
                        pageNumber
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

export { pageRouter }