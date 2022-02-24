export default class Time {
    hour: number
    minute: number
    second: number

    constructor(date: Date) {
        this.hour = date.getHours()
        this.minute = date.getMinutes()
        this.second = date.getSeconds()
    }
}