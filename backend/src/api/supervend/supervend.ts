import express from "express";
import { getPool } from "../../postgres";

const superVendAPI = express.Router()
const pool = getPool("supervend")

superVendAPI.get('/', (req, res) => {
    res.send("SuperVend API, Version 1.0")
})

superVendAPI.get('/products', (req, res) => {
    let category = req.query.category
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
            console.log(err)
            res.status(500)
            res.send("Error connecting to database.")
        })
})

export { superVendAPI }