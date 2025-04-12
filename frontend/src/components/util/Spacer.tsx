import { useEffect, useState } from "react"

function Spacer(props: { h: number | string }) {
    const [heightStr, setHeightStr]: [string, (val: string) => void] =
        useState("1px")

    useEffect(() => {
        if (typeof props.h === "number") {
            // clone tailwind's behaviour
            const rem = props.h * 0.25
            setHeightStr(`${rem}rem`)
        } else {
            setHeightStr(props.h)
        }
    }, [props.h])

    return (
        <div
            id="spacer"
            style={{ height: heightStr }}
            className="flex-none"
        ></div>
    )
}

export default Spacer
