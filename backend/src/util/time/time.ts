import { DateTime, Settings } from "luxon"

Settings.defaultZone = "Asia/Singapore"

function getLocalTime(): Date {
    return dateTimeToJSDate(DateTime.now())
}

function getUTCTime(): Date {
    return DateTime.utc().toJSDate()
}

function getLocalDateTime(): DateTime {
    return DateTime.now()
}

function getUTCDateTime(): DateTime {
    return DateTime.utc()
}

function dateTimeToJSDate(datetime: DateTime): Date {
    // very funny workaround because JS date
    return DateTime.fromObject(datetime.toObject(), {zone: "utc"}).toJSDate()
}


export { getLocalTime, getUTCTime, getLocalDateTime, getUTCDateTime, dateTimeToJSDate }