import express, { Response } from "express"
import { getPool } from "../../db/postgres"
import manifest from "./info"
import API from "../types/api";

const router = express.Router()
const pool = getPool("supervend")

const supervend = new API(router, manifest)

function handleQueryError(err: Error, res: Response) {
    console.error(err)
    res.status(500)
    res.send("Error connecting to database.")
}

router.get("/", (req, res) => {
    res.json({
        api: manifest
    })
})

router.get("/products", (req, res) => {
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

router.get("/products/:id", (req, res) => {
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

export default supervend