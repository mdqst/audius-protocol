import { Logger } from "pino"
import { Request } from "express"
import axios from "axios"
import { getClientIp } from "request-ip"
import { config } from "../config"
import { logger } from "../logger"

export type LocationData = { city: string, region: string, country: string } | {}

// gets ip data from api.ipdata.co, returns an empty object {} if api key not configured or an error occurs
export const getIpData = async (logger: Logger, ip: string): Promise<LocationData> => {
    const ipdataApiKey = config.ipdataApiKey
    if (ipdataApiKey === null) {
        logger.warn({}, "ip data requested but api key not configured")
        return {}
    }
    const url = `https://api.ipdata.co/${ip}?api-key=${config.ipdataApiKey}`
    try {
        const response = await axios.get(url)
            .then(({ data: { city, region, country_name } }: { data: { city: string, region: string, country_name: string } }) => {
                return { city, region, country: country_name }
            })
        return response
    } catch (e: unknown) {
        logger.error({ error: e }, "error requesting ip data")
        return {}
    }
}

// gets ip data from api.ipdata.co, returns an empty object {} if api key not configured or an error occurs
export const getRequestIpData = async (logger: Logger, req: Request): Promise<LocationData> => {
    try {
        const ip = getIP(req)
        return getIpData(logger, ip)
    } catch (e) {
        logger.error({ e }, "error requesting ip data")
        return {}
    }
}

// Utility to gather the IP from an incoming express request.
// Prioritizes 'X-Forwarded-For' if it exists. Otherwise returns the request objects ip.
// Throws if neither can be found.
export const getIP = (req: Request): string => {
    const clientIP = getClientIp(req)
    // https://github.com/pbojinov/request-ip?tab=readme-ov-file#how-it-works
    if (clientIP === null) {
        throw new Error("could not find client ip")
    }
    return clientIP
}

// Utility to gather the IP from an incoming express request.
// Prioritizes 'X-Forwarded-For' if it exists. Otherwise returns the request objects ip.
// Catches errors and returns an empty string as a default.
export const getIPwithDefault = (req: Request): string => {
    try {
        return getIP(req)
    } catch (e) {
        logger.error({ e }, "could not get IP")
        return ""
    }
}
