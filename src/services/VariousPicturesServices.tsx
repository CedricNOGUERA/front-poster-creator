import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

class VariousPicturesServices {
  async getVariousPictures() {
    const config = {
      method: 'GET',
      url: `${API_URL}/api/various-pictures`,
    }

    return axios.request(config)
  }

  async postPictures(newPicture: FormData) {

    const config = {
      method: 'POST',
      url: `${API_URL}/api/add-various-picture`,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body:  newPicture,
    }

    return axios.request(config)
  }


}

export default new VariousPicturesServices()