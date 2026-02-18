import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL = import.meta.env.VITE_API_URL

class LogService {

    private allLogsEndpoint = "/api/logs"
    private status500Endpoint = "/api/logs/errors/500"
    private errorEndpoint = "/api/logs/errors"

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
    const response = await axios.get(`${API_URL}${this.status500Endpoint}`,{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response
  }

  //get error log
  async getLogsError() {
    const response = await axios.get(`${API_URL}${this.errorEndpoint}`,{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    console.log(response)
    return response
  }

  // Vérification simple - appel fréquent
  // async isServerUp() {
  //   try {
  //     const res = await fetch(`${API_URL}/api/health`, {
  //       method: "GET",
  //       // timeout: 5000 // 5 secondes timeout
  //     });
  //     if (res.ok) {
  //       console.log("serveur ok");
  //     }
  //     return res.ok; // true si HTTP 200-299
  //   } catch (error) {
  //     console.log("serveur hors ligne");
  //     return false; // serveur coupé, réseau indisponible, etc.
  //   }
  // }
  async isServerUp(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_URL}/api/health`);

    console.log("serveur ok");
    return res.status >= 200 && res.status < 300;
  } catch (error) {
    console.log("serveur hors ligne");
    return false;
  }
}

  async serverStatus() { 
    try {
      const res = await axios.get(`${API_URL}/api/server-status`);
      if (res) {
        console.log(res.status);
      }
      return res.data; // true si HTTP 200-299
    } catch (error) {
      console.error(error);
      return false; // serveur coupé, réseau indisponible, etc.
    }
  }

}

const logServiceInstance = new LogService();
export default logServiceInstance;