import express from "express"
import manifest from "./info"
import API from "../types/api"
import { pageRouter } from "./pages/pages"
import { starRouter } from "./stars/stars"
import { userRouter } from "./users/users"

const router = express.Router()
const astroview = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

router.use("/pages", pageRouter)
router.use("/stars", starRouter)
router.use("/users", userRouter)

export default astroview
