export interface LoginFormDataType{
    email: string
    password: string
}

export type RoleType = 'super_admin' | 'admin' | 'user'


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