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
    console.log(newPicture)
    const config = {
      method: 'POST',
      url: `${API_URL}/api/add-various-picture`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      },
      data: newPicture,
    }

    return axios.request(config)
  }

  async deletePicture(id: number) {
    const config = {
      method: 'DELETE',
      url: `${API_URL}/api/various-pictures/${id}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }

    return axios.request(config)
  }

}

export default new VariousPicturesServices()