import { settings } from "./env/settings"
import { apiRouter } from "./api/api.www"
import http from "http"
import express from "express"

const app = express()
const port = settings.port
const domain = settings.domain
const server = http.createServer(app)

app.use("/", apiRouter)

server.listen(port, () => {
    return console.log(`Express is listening at http://${domain}:${port}`)
})