import express from "express"
import manifest from "./info.js"
import API from "../types/api.js"
import { pageRouter } from "./pages/pages.js"
import { starRouter } from "./stars/stars.js"
import { userRouter } from "./users/users.js"

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
