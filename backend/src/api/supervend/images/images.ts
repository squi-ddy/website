import express from "express"
import { getStaticUrl } from "../../../util/static/static"

const imageRouter = express.Router()

imageRouter.get("/:imageName", (req, res) => {
    res.redirect(getStaticUrl("supervend", ["images", req.params.imageName]))
})

export { imageRouter }
