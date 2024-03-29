import Meaning from "./meaning"

export default class LCSMeaning {
    readonly l: Meaning
    readonly c: Meaning
    readonly s: Meaning
    readonly sus: Meaning

    readonly day: string
    readonly id: number
    readonly checkBack?: string

    constructor(words: Meaning[], day: string, id: number, checkBack?: string) {
        if (words.length !== 4) throw new Error("Wrong length of words")
        this.l = words[0]
        this.c = words[1]
        this.s = words[2]
        this.sus = words[3]

        this.day = day
        this.id = id
        this.checkBack = checkBack
    }
}
