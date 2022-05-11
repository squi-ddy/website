export default class Time {
    readonly hour: number
    readonly minute: number
    readonly second: number

    constructor(date: Date) {
        this.hour = date.getHours()
        this.minute = date.getMinutes()
        this.second = date.getSeconds()
    }
}