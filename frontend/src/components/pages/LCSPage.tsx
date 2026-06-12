import Separator from "../util/Separator.js"
import LCS from "../../types/LCS.js"
import { getAPI } from "../../util/axios.js"
import { useEffect, useState } from "react"
import Spacer from "../util/Spacer.js"
import LCSDisplay from "../misc/LCSDisplay.js"
import LCSClean from "../../types/LCSClean.js"
import State from "../../types/State.js"

type LCSVar = LCSClean | null | undefined

function LCSPage() {
    const [lcs, setLcs]: State<LCSVar> = useState<LCSVar>(null)

    useEffect(() => {
        async function getLatestLCS(): Promise<void> {
            const resp = await getAPI("lcs/lcs")
            if (resp === undefined) {
                setLcs(undefined)
                return undefined
            } else if (resp === null) {
                return undefined
            }
            const lcs = new LCSClean(resp.data as LCS)
            setLcs(lcs)
        }

        getLatestLCS().then()
    }, [])

    const failed = (
        <>
            <p className="text-xl italic">No data :(</p>
        </>
    )
    const page = (
        <>
            <p className="text-4xl font-bold">Daily LCS #{lcs?.id}</p>
            <p className="text-l italic">{lcs?.day}</p>
            <Spacer h={2} />
            <Separator />
            <Spacer h={5} />
            <LCSDisplay isSus={false} lcs={lcs as LCSClean} />
        </>
    )

    return (
        <div className="flex flex-col items-center">
            {lcs !== null && (lcs === undefined ? failed : page)}
        </div>
    )
}

export default LCSPage
