import DateTimeObject from "./dateTimeObject"

export default class StarReview {
    constructor(
        readonly rating_id: number,
        readonly user: string,
        readonly description: string,
        readonly time: DateTimeObject,
        readonly star: number
    ) {
    }
}
