import { settings } from "./util/env/settings"
import { apiRouter } from "./api/api.www"
import http from "http"
import express from "express"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"

const app = express()
const port = settings.PORT
const domain = settings.DOMAIN
const server = http.createServer(app)

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: "50mb" }))

app.use("/", apiRouter)

server.listen(port, (): void => {
    return console.log(`Express is listening at http://${domain}:${port}`)
})
