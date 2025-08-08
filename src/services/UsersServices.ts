import { UserDataType } from "@/stores/userDataStore"
// import { UserDataType } from "@/types/UserType"

const API_URL = import.meta.env.VITE_API_URL

class UsersServices {

    async getAllUsers(){
        const response = await fetch(`${API_URL}/api/users`)
        return response
    }

    async getMe(){
        const response = await fetch(`${API_URL}/api/get-me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        return response
    }
    
    async updateUser(id: number, data: Partial<UserDataType>){
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        })
        console.log(response)
        return response
    }
    
    async deleteUser(id: number){
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        return response
    }
}

export default new UsersServices()
