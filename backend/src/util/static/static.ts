import { settings } from "../env/settings"

function getStaticUrl(apiName: string, path: string[]) {
    return `${settings.STATIC_SITE_PROTOCOL}://${settings.STATIC_SITE_NAME}/${apiName}/${path.join('/')}`
}

export { getStaticUrl }