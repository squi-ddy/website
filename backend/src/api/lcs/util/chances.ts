import LCSChances from "../types/lcsChances"
import StartChances from "../types/startChances"

function indexChances(chances: LCSChances, index: number): StartChances[] {
    switch (index) {
        case 0:
            return chances.l
        case 1:
            return chances.c
        case 2:
            return chances.s
        case 3:
            return chances.sus
        default:
            throw new Error("Invalid index")
    }
}

export { indexChances }