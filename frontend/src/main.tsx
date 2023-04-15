import React from "react"
import {createRoot} from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
    Route
} from "react-router-dom";
import BasePage from "./components/BasePage"
import "./index.css"

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (
                <BasePage title="Homepage">

                </BasePage>
            )
        },
        {
            path: "/prompt-artistry",
            element: (
                <BasePage title="Prompt Artistry">

                </BasePage>
            )
        }
    ]
)

createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
