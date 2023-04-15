import React, { useEffect } from "react"

function BasePage(props: { title: string; children?: React.ReactNode }) {
    useEffect(() => {
        document.title = props.title
    }, [props.title])

    return (
        <div className="h-screen w-screen">
            <div className="flex justify-center p-2 bg-gradient-to-r from-cyan-800 to-cyan-900 mb-1">
                <h1 className="text-2xl font-bold">{props.title}</h1>
            </div>

            {props.children}
        </div>
    )
}

export default BasePage
