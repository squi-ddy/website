export default class LCS {
    readonly l: string
    readonly c: string
    readonly s: string
    readonly sus: string

    constructor(words: string[]) {
        if (words.length !== 4)
            throw new Error("Wrong length of words")
        this.l = words[0]
        this.c = words[1]
        this.s = words[2]
        this.sus = words[3]
    }
}