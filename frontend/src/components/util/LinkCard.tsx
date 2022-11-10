import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowForward } from "@mui/icons-material"
import { useState } from "react"

function LinkCard(props: { title: string; link: string }) {
    const [hover, setHover] = useState(false)

    return (
        <div
            className="w-10/12 rounded border transition-all duration-500 hover:scale-[102.5%] hover:bg-violet-800"
            onMouseEnter={() => {
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
            }}
        >
            <Link
                to={props.link}
                className="flex items-center justify-center gap-x-2 p-5 no-underline"
            >
                <AnimatePresence mode="popLayout">
                    <motion.h2
                        layout="position"
                        className="text-3xl font-bold"
                        key="h2"
                    >
                        {props.title}
                    </motion.h2>

                    {hover && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="icon"
                        >
                            <ArrowForward className="mb-1"></ArrowForward>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>
        </div>
    )
}

export default LinkCard