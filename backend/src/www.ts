import express from "express"
import vhost from "vhost"
import { settings } from "./env/settings"
import { apiRouter } from "./api/api.www"
import * as http from "http";

const app = express()
const port = settings.port
const domain = settings.domain
const server = http.createServer(app)

app.use(vhost(`api.${domain}`, apiRouter))

app.get("/", (req, res) => {
    res.send("???")
})

server.listen(port, () => {
    return console.log(`Express is listening at http://test:${port}`)
})