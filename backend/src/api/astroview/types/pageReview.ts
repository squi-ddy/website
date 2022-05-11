import Time from "./time"

export default class PageReview {
    constructor(
        readonly rating_id: number,
        readonly user: string,
        readonly description: string,
        readonly time: Time,
        readonly page: number
    ) {
    }
}