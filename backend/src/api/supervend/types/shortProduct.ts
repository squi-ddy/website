import Rating from "./rating"

export default class ShortProduct {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly category: string,
        readonly preview: string,
        readonly price: number,
        readonly rating: Rating
    ) {
    }
}