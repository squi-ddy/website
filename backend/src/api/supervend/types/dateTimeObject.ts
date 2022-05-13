export default class DateTimeObject {
    readonly day: number
    readonly month: number
    readonly year: number
    readonly hour: number
    readonly minute: number
    readonly second: number

    constructor(date: Date) {
        this.hour = date.getHours()
        this.minute = date.getMinutes()
        this.second = date.getSeconds()
        this.day = date.getDate()
        this.month = date.getMonth() + 1
        this.year = date.getFullYear()
    }
}