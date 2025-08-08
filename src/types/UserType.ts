export interface LoginFormDataType{
    email: string
    password: string
}

export interface UserType {
  id: number
  email: string
  password: string
  name: string
  company: {
    idCompany: number
    nameCompany: string
  }
  role: 'super_admin' | 'admin' | 'user'
}