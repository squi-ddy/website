import type { Router } from "express"
import type Info from "./info"

export default class API {
    router: Router
    info: Info

    constructor(router: Router, info: Info) {
        this.router = router
        this.info = info
    }
}