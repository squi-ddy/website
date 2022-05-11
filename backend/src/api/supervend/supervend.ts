import express from "express"
import manifest from "./info"
import API from "../types/api"
import { productRouter } from "./products/products"
import { userRouter } from "./users/users"
import { categoryRouter } from "./categories/categories"
import { imageRouter } from "./images/images"

const router = express.Router()
const supervend = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest
    })
})

router.use("/products", productRouter)
router.use("/users", userRouter)
router.use("/categories", categoryRouter)
router.use("/images", imageRouter)

export default supervend