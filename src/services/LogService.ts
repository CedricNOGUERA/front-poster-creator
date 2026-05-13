import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL = import.meta.env.VITE_API_URL);

class LogService {
  private paginatedLogs = "/api/logs/paginated";
  private allLogsEndpoint = "/api/logs";
  private status500Endpoint = "/api/logs/errors/500";
  private errorEndpoint = "/api/logs/errors";

  async getPaginatedLogs(
    page: string,
    perPage: string,
    route: string,
    level: string,
    user: string,
    message: string,
    createdAt: string,
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      perPage: `${perPage}`,
      route: `${route}`,
      level: `${level}`,
      user: `${user}`,
      message: `${message}`,
      createdAt: `${createdAt}`,
    });

    const response = await fetch(
      `${API_URL}${this.paginatedLogs}?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response.json();
  }

  //get all logs
  async getLogs() {
    const response = await axios.get(`${API_URL}${this.allLogsEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }

  //get error logs status 500
  async getLogsError500() {
    const response = await axios.get(`${API_URL}${this.status500Endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }

  //get error log
  async getLogsError() {
    const response = await axios.get(`${API_URL}${this.errorEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.error(response);
    return response;
  }

  async isServerUp(): Promise<boolean> {
    try {
      const res = await axios.get(`${API_URL}/api/health`);

      return res.status >= 200 && res.status < 300;
    } catch (error) {
      console.error("serveur hors ligne : ", error);
      return false;
    }
  }

  async serverStatus() {
    try {
      const res = await axios.get(`${API_URL}/api/server-status`);
   
      return res.data; // true si HTTP 200-299
    } catch (error) {
      console.error(error);
      return false; // serveur coupé, réseau indisponible, etc.
    }
  }
}

const logServiceInstance = new LogService();
export default logServiceInstance;
