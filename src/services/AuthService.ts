import { LoginFormDataType, UserType } from "@/types/UserType";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

class AuthService {
  async loginUser(credentials: LoginFormDataType) {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const data = JSON.stringify(credentials);

    const config = {
      method: "POST",
      url: `${API_URL}/api/login`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };
    return axios.request(config);
  }

  async register(formData: Partial<UserType>) {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return response;
  }

  async verifyRestToken(token: string, email: string) {
    const response = await axios.get(`${API_URL}/api/verify-reset-token`, {
      params: {
        token,
        email,
      },
    });
    return response.data.valid;
  }

  async resetPassword(email: string, token: string, password: string) {
    const response = await axios.post(`${API_URL}/api/reset-password`, {
      email,
      token,
      newPassword: password,
    });

    return response.data;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
