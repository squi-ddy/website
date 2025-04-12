import LinkCard from "../util/LinkCard"
import Separator from "../util/Separator"
import Spacer from "../util/Spacer"

function HomePage() {
    return (
        <div className="flex flex-col items-center">
            <p className="text-xl italic">Hey! A website!</p>
            <Spacer h={2} />
            <Separator />
            <Spacer h={2} />
            <h2 className="text-2xl font-bold">Pages</h2>
            <Spacer h={2} />
            <ul className="flex w-full flex-col items-center gap-4">
                <LinkCard title="Daily LCS" link="/lcs" />
                <LinkCard title="Bridge" link="/bridge" properLink />
            </ul>
        </div>
    )
}

export default HomePage
