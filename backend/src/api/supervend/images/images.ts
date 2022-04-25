import express from "express"
import { settings } from "../../../env/settings"

const categoryRouter = express.Router()

categoryRouter.get("/:imageName",
    (req, res) => {
        res.redirect(`${settings.STATIC_SITE_PROTOCOL}://${settings.STATIC_SITE_NAME}/supervend/images/${req.params.imageName}`)
    }
)

export { categoryRouter }