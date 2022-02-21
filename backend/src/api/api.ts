import express from "express";
import {superVendAPI} from "./supervend/supervend";

const apiRouter = express.Router()

apiRouter.use("/supervend", superVendAPI)

export { apiRouter }