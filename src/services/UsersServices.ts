import { UserType } from "@/types/UserType";

const API_URL = import.meta.env.VITE_API_URL;

class UsersServices {
  async getAllUsers() {
    const response = await fetch(`${API_URL}/api/users`);
    return response;
  }

  async getPaginatedUsers(
    page: string,
    perPage: string,
    company: string,
    store: string,
    name: string,
    email: string,
    role: string,
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      perPage: `${perPage}`,
      company: `${company}`,
      store: `${store}`,
      name: `${name}`,
      email: `${email}`,
      role: `${role}`,
    });

    const response = await fetch(
      `${API_URL}/api/users/paginated?${params.toString()}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.json();
  }

  async getMe() {
    const response = await fetch(`${API_URL}/api/get-me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }

  async updateUser(id: number, data: Partial<UserType>) {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteUser(id: number) {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }
}

export default new UsersServices();
