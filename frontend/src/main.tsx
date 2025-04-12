import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import BasePage from "./components/misc/BasePage"
import { BrowserRouter } from "react-router-dom"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import avatar from "./public/avatar.png"

const iconElement = document.createElement("link")
iconElement.rel = "icon"
iconElement.href = avatar

document.head.appendChild(iconElement)

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <BasePage />
        </BrowserRouter>
    </StrictMode>
)
