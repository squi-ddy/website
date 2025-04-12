import { useEffect, useState, Fragment } from "react"
import LCSClean from "../../types/LCSClean"

function LCSDisplay(props: {
    isSus: boolean
    lcs: LCSClean
}) {
    const [words, setWords] = useState([
        props.lcs.words[0],
        props.lcs.words[1],
        props.isSus ? props.lcs.words[3] : props.lcs.words[2],
    ])

    useEffect(() => {
        setWords([
            props.lcs.words[0],
            props.lcs.words[1],
            props.isSus ? props.lcs.words[3] : props.lcs.words[2],
        ])
    }, [props.isSus, props.lcs])

    const [isOpen, setIsOpen] = useState(new Array(4).fill(false) as boolean[])

    return (
        <div id="lcs" className="flex flex-col items-center">
            {words.map((word: string, i: number) => {
                return (
                    <Fragment key={word}>
                        <p
                            className="my-1 cursor-pointer text-3xl font-bold italic transition-all hover:text-cyan-500"
                            onClick={() => {
                                const isOpenCopy = [...isOpen]
                                isOpenCopy[i] = !isOpenCopy[i]
                                setIsOpen(isOpenCopy)
                            }}
                        >
                            {word}
                        </p>
                    </Fragment>
                )
            })}
        </div>
    )
}

export default LCSDisplay
