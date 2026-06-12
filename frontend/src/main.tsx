import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import BasePage from "./components/misc/BasePage.js"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <BasePage />
        </BrowserRouter>
    </StrictMode>,
)
