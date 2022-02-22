import express from "express"
import vhost from "vhost"
import { settings } from "./env/settings"
import { apiRouter } from "./api/api"

const app = express()
const port = settings.port
const domain = settings.domain

app.use(vhost(`api.${domain}`, apiRouter))

app.get("/", (req, res) => {
    res.send("???")
})

app.listen(port, () => {
    return console.log(`Express is listening at http://api.test:${port}`)
})