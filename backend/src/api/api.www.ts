import express from "express"
import API from "./types/api"
import supervend from "./supervend/supervend"
import astroview from "./astroview/astroview"
import lcs from "./lcs/lcs"
import cors from "cors"

const apiRouter = express.Router()
const apis: API[] = [supervend, astroview, lcs]

apiRouter.use(cors())

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (_req, res): void => {
    res.json({
        apis: apis,
    })
})

export { apiRouter }
