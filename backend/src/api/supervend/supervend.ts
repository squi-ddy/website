import express from "express"
import manifest from "./info.js"
import API from "../types/api.js"
import { productRouter } from "./products/products.js"
import { userRouter } from "./users/users.js"
import { categoryRouter } from "./categories/categories.js"
import { imageRouter } from "./images/images.js"

const router = express.Router()
const supervend = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

router.use("/products", productRouter)
router.use("/users", userRouter)
router.use("/categories", categoryRouter)
router.use("/images", imageRouter)

export default supervend
