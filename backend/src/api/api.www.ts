import express from "express"
import supervend from "./supervend/supervend"
import API from "./types/api"

const apiRouter = express.Router()
const apis: API[] = [ supervend ]

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (req, res): void => {
    res.json({
        "apis": apis
    })
})

export { apiRouter }