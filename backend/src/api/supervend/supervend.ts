import express, { Response } from "express"
import { getPool } from "../../db/postgres"

const superVendAPI = express.Router()
const pool = getPool("supervend")

function handleQueryError(err: Error, res: Response) {
    console.error(err)
    res.status(500)
    res.send("Error connecting to database.")
}

superVendAPI.get("/", (req, res) => {
    res.send("SuperVend API, Version 1.0")
})

superVendAPI.get("/products", (req, res) => {
    const category = req.query.category
    pool.query(`
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
        `, [category])
        .then(rows => {
            res.json(rows.rows)
        })
        .catch(err => {
            handleQueryError(err, res)
        })
})

superVendAPI.get("/products/:id", (req, res) => {
    const productId = req.params.id
    pool.query(`
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
        `, [productId])
        .then(rows => {
            if (rows.rows.length == 0) {
                res.status(404)
                res.send("No such product.")
            } else {
                res.json(rows.rows[0])
            }
        })
        .catch(err => {
            handleQueryError(err, res)
        })
})

export { superVendAPI }