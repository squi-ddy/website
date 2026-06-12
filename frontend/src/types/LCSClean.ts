import LCS from "./LCS.js"

export default class LCSClean {
    words: string[]
    day: string
    id: number

    constructor(lcs: LCS) {
        this.words = [lcs.l.word, lcs.c.word, lcs.s.word, lcs.sus.word]
        this.day = lcs.day
        this.id = lcs.id
    }
}
