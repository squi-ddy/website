import { Route, Routes, useLocation } from "react-router-dom"
import Page from "../components/misc/Page.js"
import HomePage from "../components/pages/HomePage.js"
import LCSPage from "../components/pages/LCSPage.js"

function WebsiteRouter(props: { setTitle: (title: string) => void }) {
    const location = useLocation()

    return (
        <Routes key={location.pathname} location={location}>
            <Route
                path="/"
                element={
                    <Page title="Homepage" setTitle={props.setTitle}>
                        <HomePage />
                    </Page>
                }
            />
            <Route
                path="/lcs"
                element={
                    <Page title="Daily LCS" setTitle={props.setTitle}>
                        <LCSPage />
                    </Page>
                }
            />
        </Routes>
    )
}

export default WebsiteRouter
