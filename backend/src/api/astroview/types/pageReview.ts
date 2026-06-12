import DateTimeObject from "./dateTimeObject.js"

export default class PageReview {
    constructor(
        readonly rating_id: number,
        readonly user: string,
        readonly description: string,
        readonly time: DateTimeObject,
        readonly page: number,
    ) {}
}
