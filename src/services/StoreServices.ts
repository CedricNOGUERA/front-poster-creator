import { StoresType } from "@/types/StoresType";

const API_URL = (import.meta.env.VITE_API_URL = import.meta.env.VITE_API_URL);

class StoreServices {
  async paginatedStores(
    page: string,
    perPage: string,
    id: string,
    name: string,
    company: string,
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      perPage: `${perPage}`,
      id: `${id}`,
      name: `${name}`,
      company: `${company}`,
    });

    const response = await fetch(
      `${API_URL}/api/stores/paginated?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response.json();
  }

  async createStore(newStore: {
  name: string;
  companyId: number;
}) {

    const response = await fetch(`${API_URL}/api/add-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newStore),
    });
    return response;
  }

  async patchStore(id: number, data: Partial<StoresType>) {
    const response = await fetch(`${API_URL}/api/stores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  }

  async deleteStore(id: number) {
    const response = await fetch(`${API_URL}/api/stores/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  }
}

const storeServiceInstance = new StoreServices();
export default storeServiceInstance;
