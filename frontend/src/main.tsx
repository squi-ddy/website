import React from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import BasePage from "./components/BasePage"
import PromptArtistry from "./components/PromptArtistry"
import "./index.css"

const router = createBrowserRouter([
    {
        path: "/",
        element: <BasePage title="Homepage"></BasePage>,
    },
    {
        path: "/prompt-artistry",
        element: (
            <BasePage title="Prompt Artistry">
                <PromptArtistry />
            </BasePage>
        ),
    },
    {
        path: "*",
        element: (
            <BasePage title="404">
                <div className="grow text-xl text-center">This page doesn&#39;t exist</div>
            </BasePage>
        ),
    },
])

createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
