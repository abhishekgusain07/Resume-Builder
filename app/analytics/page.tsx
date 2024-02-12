import { analytics } from "@/utils/analytics"
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard"
import { getDate } from "@/utils"

const Page = async() => {
    const TRACKING_DAYS = 7
    const pageView = await analytics.retrieveDays("pageView", TRACKING_DAYS)

    const totalPageviews = pageView.reduce((acc, curr) => {
        return (
            acc+curr.events.reduce((acc, curr) => {
                return acc+Object.values(curr)[0]!
            },0)
        )
    }, 0)

    const avgVisitorsPerDay = (totalPageviews / TRACKING_DAYS).toFixed(1)

    const amtVisitorsToday = pageView.filter((ev) => ev.date === getDate()).reduce((acc, curr) => {
        return (
            acc+curr.events.reduce((acc, curr) => {
                return (
                    acc+Object.values(curr)[0]!
                )
            },0)
        )
    },0)

    const topCountriesMap = new Map<string, number>()
    for(let i = 0; i < pageView.length; ++i) {
        const day = pageView[i];
        if(!day)continue;

        for(let j = 0; j < day.events.length; ++j) {
            const event = day.events[j];
            if(!event)continue;

            const key = Object.keys(event)[0]!
            const value = Object.values(event)[0]!

            const parsedKey = JSON.parse(key)
            const country = parsedKey?.country
            if(country) {
                if(topCountriesMap.has(country)) {
                    const prevValue = topCountriesMap.get(country)!
                    topCountriesMap.set(country, prevValue+value)
                } else {
                    topCountriesMap.set(country, value)
                }
            }
        }

    }

    const topCountries = [...topCountriesMap.entries()].sort((a, b) => {
        if(a[1] > b[1])return -1;
        else return 1
    }).slice(0, 5)

    
    return (
        <>
            <div className="flex items-center text-center justify-center mt-4 ">
                <h1  className="text-primary pb-2 text-4xl font-bold lg:text-5xl">Traffic on the Site</h1>
            </div>
            <div className="min-h-screen w-full py-12 flex justify-center items-center">
                <div className="relative w-full max-w-6xl mx-auto text-white">
                    <AnalyticsDashboard avgVisitorsPerDay={avgVisitorsPerDay}
                    amtVisitorsToday={amtVisitorsToday}
                    timeSeriesPageviews={pageView}
                    topCountries={topCountries}
                    />
                </div>
            </div>
        </>
    )
}
export default Page