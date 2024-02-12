import { NextRequest, NextResponse } from "next/server";
import { Analytics, analytics } from "./utils/analytics";

export default async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname === '/') {
        // track analytics event

        try {
            analytics.track('pageView', {
                page:'/',
                country: req.geo?.country
            })
        } catch (err) {
            // fail silently
            console.log(err)
        }
    }
    return NextResponse.next()
}

export const matcher = {
    matcher: ['/']
}