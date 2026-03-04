import axios from "axios"


class StatServices {

    async getConnexionCount() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/connexions`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            return response.data

        }catch(e){
            console.log(e)
        }
    }

    async getStatConnexions() {
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/connexions/stats`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            return response.data
        }catch(e){
            console.log(e)
        }
    }

}

export default new StatServices()