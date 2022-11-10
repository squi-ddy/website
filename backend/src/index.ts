import { settings } from "./util/env/settings"
import { apiRouter } from "./api/api.www"
import http from "http"
import express from "express"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"

const app = express()
const port = settings.PORT
const domain = settings.DOMAIN
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(compression())
app.use(helmet())

app.use("/", apiRouter)

server.listen(port, (): void => {
    return console.log(`Express is listening at http://${domain}:${port}`)
})
