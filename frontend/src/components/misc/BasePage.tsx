import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import WebsiteRouter from "../../router/WebsiteRouter"
import Spacer from "../util/Spacer"

import avatar from "../../public/avatar.png"
import { useTitle } from "react-use"

function BasePage() {
    const [title, setTitle] = useState("")

    useTitle(title)

    return (
        <div>
            <div
                id="header"
                className="mb-2 grid h-12 overflow-hidden grid-flow-row grid-cols-3 items-center justify-items-center bg-gradient-to-r from-cyan-800 to-cyan-900 p-2"
            >
                <motion.a
                    href="https://github.com/squi-ddy"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="col-start-1 h-full justify-self-start max-h-full"
                >
                    <img src={avatar} alt="icon" className="h-full max-h-full object-scale-down" />
                </motion.a>
                <AnimatePresence mode="wait">
                    {title !== "" && (
                        <motion.h1
                            className="col-start-2 text-2xl font-bold"
                            key={title}
                            initial={{ y: "-50%", opacity: 1 }}
                            animate={{ y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            {title}
                        </motion.h1>
                    )}
                </AnimatePresence>
            </div>

            <Spacer h={5} />

            <WebsiteRouter setTitle={setTitle} />
        </div>
    )
}

export default BasePage
