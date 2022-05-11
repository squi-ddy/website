import Time from "./time"

export default class StarReview {
    constructor(
        readonly rating_id: number,
        readonly user: string,
        readonly description: string,
        readonly time: Time,
        readonly star: number
    ) {
    }
}