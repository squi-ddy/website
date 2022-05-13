export default class DateObject {
    readonly day: number
    readonly month: number
    readonly year: number

    constructor(date: Date) {
        this.day = date.getDate()
        this.month = date.getMonth() + 1
        this.year = date.getFullYear()
    }
}