import LCSChances from "../types/lcsChances"
import StartChances from "../types/startChances"
import LCS from "../types/lcs"

function normaliseChances(chances: LCSChances): LCSChances {
    for (const chanceArray of chances.chancesArray) {
        let sum = 0

        chanceArray.forEach((value) => {
            sum += value.weight
        })
        chanceArray.forEach((value) => {
            value.weight /= sum
        })
    }

    return chances
}

function selectFromChances(chances: StartChances[]): string {
    let number = Math.random()
    for (const chance of chances) {
        if (number < chance.weight) return chance.startsWith
        number -= chance.weight
    }
    return chances[0].startsWith // just in case floating point precision causes issues
}

function indexLCS(lcs: LCS, index: number): string {
    switch (index) {
        case 0:
            return lcs.l
        case 1:
            return lcs.c
        case 2:
            return lcs.s
        case 3:
            return lcs.sus
        default:
            throw new Error(`Invalid index ${index}`)
    }
}

export { normaliseChances, selectFromChances, indexLCS }
