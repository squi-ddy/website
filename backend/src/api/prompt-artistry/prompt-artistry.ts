import express from "express"
import API from "../types/api"
import manifest from "./info"
import axios from "axios"

const router = express.Router()
const prompt_artistry = new API(router, manifest)

router.get("/", (_req, res) => {
    res.json({
        api: manifest,
    })
})

router.post("/submit", async (req, res) => {
    const resp = await axios.post("http://10.68.131.128:12887/submit", {
        data: req.body.image,
    })

    res.json(resp.data)
})

export default prompt_artistry
