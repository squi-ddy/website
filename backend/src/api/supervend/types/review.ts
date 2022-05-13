import DateTimeObject from "./dateTimeObject"

export default class Review {
    constructor(
        readonly product_id: string,
        readonly user: string,
        readonly rating: number,
        readonly content: string,
        readonly time: DateTimeObject
    ) {
    }
}