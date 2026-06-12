import express from "express"
import API from "../types/api.js"
import manifest from "./info.js"
import { lcsRouter } from "./api.js"

const router = express.Router()
const lcs = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

router.use("/lcs", lcsRouter)

export default lcs
