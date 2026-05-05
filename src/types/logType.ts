import { Status } from "./DiversType"

export interface LogType {
    "id": number
    "timestamp": string,
    "level": Status,
    "message": string,
    "route": string,
    "user": string | null,
    "meta": Record<string, string | number | boolean | null> | null
}


export interface LogResultType {
    "total": number
    "page": number
    "perPage": number
    "offset": number
    "logs": LogType[]
}