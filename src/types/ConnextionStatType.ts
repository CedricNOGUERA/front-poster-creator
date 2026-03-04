export interface ConnexionStatType {
    "total": number
    "limit": number,
    "offset": number,
    "connexions":ConnexionType[]
}

export type ConnexionType = {
            "name": string,
            "email": string,
            "company": {
                "nameCompany": string,
                "idCompany": number
            },
            "dateOfConnexion": string
        }