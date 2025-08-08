import { LoginFormDataType, UserType } from "@/types/UserType";
import axios from "axios";

class AuthService {
  async loginUser(credentials: LoginFormDataType) {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const data = JSON.stringify(credentials);

    const config = {
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/api/login`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };
    return axios.request(config);
  }

  async register(formData: Partial<UserType>) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    return response;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
