import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL = import.meta.env.VITE_API_URL

class LogService {

    private allLogsEndpoint = "/api/logs"
    private status500Endpoint = "/api/logs/errors/500"
    private errorEndpoint = "/api/logs/errors"

  async getLog() {
    const response = await axios.get(`${API_URL}${this.allLogsEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response;
  }
  async getlogsError500() {
    const response = await axios.get(`${API_URL}${this.status500Endpoint}`,{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response
  }
  async getlogsError() {
    const response = await axios.get(`${API_URL}${this.errorEndpoint}`,{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response
  }
}

const logServiceInstance = new LogService();
export default logServiceInstance;