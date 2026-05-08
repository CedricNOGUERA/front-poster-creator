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
}

const storeServiceInstance = new StoreServices();
export default storeServiceInstance;
