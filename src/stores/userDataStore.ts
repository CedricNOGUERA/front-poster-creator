import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type UserDataType = {
  id: number
  email: string
  name: string
  company: {
    idCompany: number
    nameCompany: string
  }[]
  role: 'super_admin' | 'admin' | 'user'
  authLogin: (
    id: number,
    email: string,
    name: string,
    company: { idCompany: number; nameCompany: string }[],
    role: 'super_admin' | 'admin' | 'user'
  ) => void
  authLogout: () => void
}

const userDataStore = create(
  persist<UserDataType>(
    (set) => ({
      // initial state
      id: 0,
      email: '',
      name: '',
      company: [],
      role: 'user',

      authLogin: (
        id: number,
        email: string,
        name: string,
        company: {
          idCompany: number
          nameCompany: string
        }[],
        role: 'super_admin' | 'admin' | 'user'
      ) =>
        set(() => ({
          id: id,
          email: email,
          name: name,
          company: company,
          role: role,
        })),
      authLogout: () =>
        set(() => ({
          id: 0,
          email: '',
          name: '',
          company: [],
          role: 'user',
        })),
    }),
    {
      name: 'userData',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default userDataStore
