import express from "express"
import API from "./types/api"
import supervend from "./supervend/supervend"
import astroview from "./astroview/astroview"
import lcs from "./lcs/lcs"
import prompt_artistry from "./prompt-artistry/prompt-artistry"

const apiRouter = express.Router()
const apis: API[] = [supervend, astroview, lcs, prompt_artistry]

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (_req, res): void => {
    res.json({
        apis: apis,
    })
})

apiRouter.post("/bot_login", (_req, res): void => {
    console.log(_req.body)
})

export { apiRouter }
