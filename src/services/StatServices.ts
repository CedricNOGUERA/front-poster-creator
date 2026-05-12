import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

class StatServices {
  async getConnexionCount() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/connexions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  async paginatedConnexion(
    page: string,
    perPage: string,
    email: string,
    name: string,
    company: string,
    connectedAt: string,
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      perPage: `${perPage}`,
      email: `${email}`,
      name: `${name}`,
      company: `${company}`,
      connectedAt: `${connectedAt}`,
    });

    try {
      const response = await fetch(`${API_URL}/api/connexions?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.json();
    } catch (e) {
      console.error(e);
    }
  }

  async getStatConnexions() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/connexions/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new StatServices();
