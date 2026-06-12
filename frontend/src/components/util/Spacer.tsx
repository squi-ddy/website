function Spacer(props: { h: number | string }) {
    let heightStr: string

    if (typeof props.h === "number") {
        // clone tailwind's behaviour
        const rem = props.h * 0.25
        heightStr = `${rem}rem`
    } else {
        heightStr = props.h
    }

    return (
        <div
            id="spacer"
            style={{ height: heightStr }}
            className="flex-none"
        ></div>
    )
}

export default Spacer
