import express from "express"
import API from "../types/api"
import manifest from "./info"
import { lcsRouter } from "./api"

const router = express.Router()
const lcs = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest
    })
})

router.use("/lcs", lcsRouter)

export default lcs