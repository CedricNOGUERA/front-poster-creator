
import { UserType, LoginFormDataType } from "@/types/UserType"
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

class AuthService {


  async loginUser(credentials: LoginFormDataType) {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const data = JSON.stringify(credentials);

    const config = {
      method: 'POST',
      // url: 'http://192.168.220.36:8000/api/auth/login',
      url: 'http://localhost:8081/api/login',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: data,
    }
    return axios.request(config)
  }

  async register(formData: Partial<UserType>) {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    return response
  }
}

const authServiceInstance = new AuthService
export default authServiceInstance