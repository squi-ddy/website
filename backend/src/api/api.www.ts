import express from "express"
import supervend from "./supervend/supervend"
import API from "./types/api"
import astroview from "./astroview/astroview"

const apiRouter = express.Router()
const apis: API[] = [supervend, astroview]

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (_req, res): void => {
    res.json({
        "apis": apis
    })
})

export { apiRouter }