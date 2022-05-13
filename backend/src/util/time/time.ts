import { DateTime, Settings } from "luxon"

Settings.defaultZone = "Asia/Singapore"

function getLocalTime(): Date {
    // very funny workaround because JS
    return DateTime.fromObject(DateTime.now().toObject(), {zone: "utc"}).toJSDate()
}

function getUTCTime(): Date {
    return DateTime.utc().toJSDate()
}

export { getLocalTime, getUTCTime }