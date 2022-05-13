import Rating from "./rating"
import DateObject from "./dateObject"

export default class Product {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly category: string,
        readonly description: string,
        readonly company: string,
        readonly temperature: number,
        readonly size: string,
        readonly country: string,
        readonly expiry: DateObject,
        readonly stock: number,
        readonly preview: string,
        readonly images: string[],
        readonly price: number,
        readonly rating: Rating
    ) {
    }
}