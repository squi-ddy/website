import express from "express"
import { getPool, handleQueryError } from "../../../db/postgres"
import Time from "../../types/time"
import { authenticate } from "../auth"

const productRouter = express.Router()
const pool = getPool("supervend")

productRouter.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const result = await pool.query(
            `
            SELECT
            product_id,
                name,
                category,
                preview,
                price,
                rating,
                rating_ct
            FROM products
            WHERE category = COALESCE($1, category)
            `,
            [category])
        res.json(result.rows)
    } catch (err) {
        handleQueryError(err, res)
    }
})

productRouter.get("/:id", async (req, res) => {
    const productId = req.params.id
    try {
        const result = await pool.query(
            `
            SELECT
                product_id,
                category,
                name,
                description,
                company,
                price,
                temp,
                size,
                country,
                expiry,
                stock,
                preview,
                images,
                rating,
                rating_ct
            FROM products
            WHERE product_id = $1
            `,
            [productId])
        if (result.rowCount == 0) {
            res.status(404)
            res.send("No such product.")
        } else {
            res.json(result.rows[0])
        }
    } catch (err) {
        handleQueryError(err, res)
    }
})

productRouter.get("/:id/ratings", async (req, res) => {
    const productId = req.params.id
    const results = {
        reviews: [],
        summary: {
            total: 0,
            count: 0
        }
    }
    try {
        let result = await pool.query(
            "SELECT rating, rating_ct FROM products WHERE product_id = $1",
            [productId]
        )
        if (result.rowCount == 0) {
            res.status(404)
            res.send("No such product.")
            return
        }
        let record = result.rows[0]
        results.summary.count = record.rating_ct
        results.summary.total = record.rating

        result = await pool.query(
            `
            SELECT
                product_id,
                name,
                rating,
                content,
                time
            FROM ratings
            WHERE product_id = $1
            `,
            [productId]
        )
        for (record of result.rows) {
            results.reviews.push(
                {
                    product_id: record.product_id,
                    user: record.name,
                    rating: record.rating,
                    content: record.content,
                    time: new Time(record.time)
                }
            )
        }
        res.json(results)
    } catch (err) {
        handleQueryError(err, res)
    }
})

productRouter.post("/:id/ratings", authenticate, (res, req) => {
    // TODO: Port API
})

export { productRouter }