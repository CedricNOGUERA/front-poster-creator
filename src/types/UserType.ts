export interface LoginFormDataType{
    email: string
    password: string
}

export type RoleType = 'mega_admin' | 'super_admin' | 'admin' | 'user'


export interface UserType {
  id: number
  email: string
  password: string
  name: string
  company: {
    idCompany: number
    nameCompany: string
  }[]
  stores?: {
    id: number
    name: string
  }[]
  role: RoleType
  passwordHash?: string
}

export interface ResultUserType {
  "total": number,
      "page": number,
      "perPage": number,
      "offset": number,
      "preview": boolean,
      "next": boolean,
      "users": UserType[]
}