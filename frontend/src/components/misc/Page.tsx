import { ReactNode, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

function Page(props: {
    title: string
    setTitle: (title: string) => void
    children?: ReactNode
}) {
    useEffect(() => {
        props.setTitle(props.title)
    }, [props.setTitle, props.title])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                id="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {props.children}
            </motion.div>
        </AnimatePresence>
    )
}

export default Page
