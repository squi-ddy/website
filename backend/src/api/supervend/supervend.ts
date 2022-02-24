import express from "express"
import manifest from "./info"
import API from "../types/api"
import { productRouter } from "./products/products"

const router = express.Router()
const supervend = new API(router, manifest)

router.get("/", (req, res) => {
    res.json({
        api: manifest
    })
})

router.use("/products", productRouter)

export default supervend