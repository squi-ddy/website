import express from "express"
import API from "./types/api.js"
import supervend from "./supervend/supervend.js"
import astroview from "./astroview/astroview.js"
import lcs from "./lcs/lcs.js"
import prompt_artistry from "./prompt-artistry/prompt-artistry.js"
import nytGames from "./nyt-games/nyt-games.js"

const apiRouter = express.Router()
const apis: API[] = [supervend, astroview, lcs, prompt_artistry, nytGames]

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (_req, res): void => {
    res.json({
        apis: apis,
    })
})

export { apiRouter }
