import express from "express"
import API from "./types/api"
import supervend from "./supervend/supervend"
import astroview from "./astroview/astroview"
import lcs from "./lcs/lcs"
import prompt_artistry from "./prompt-artistry/prompt-artistry"
import cookieParser from "cookie-parser"

const apiRouter = express.Router()
apiRouter.use(cookieParser())
const apis: API[] = [supervend, astroview, lcs, prompt_artistry]

for (const api of apis) {
    apiRouter.use(`/${api.info.link}`, api.router)
}

apiRouter.get("/", (_req, res): void => {
    res.json({
        apis: apis,
    })
})

apiRouter.get("/ctf", (_req, res): void => {
    console.log(_req.cookies)
    res.json({
        a:1
    })
})

export { apiRouter }
