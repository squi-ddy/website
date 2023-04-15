import axios, { CreateAxiosDefaults } from "axios"

function getAxios(baseUrl: string, options?: CreateAxiosDefaults) {
    return axios.create({
        baseURL: baseUrl,
        ...options,
    })
}

const api = getAxios("https://api.squiddy.me")

export { getAxios, api }
