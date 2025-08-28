import { CategoriesType } from "@/types/CategoriesType"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

class CategoriesService {


    async postCategory(newCategory: FormData){
        const response = await fetch(`${API_URL}/api/add-categories`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
              },
              body:  newCategory,
            })
            
            return response
    }

    async getCategories(setCat: React.Dispatch<React.SetStateAction<CategoriesType[]>>) {
      const response = await fetch(`${API_URL}/api/categories`)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories')
      }

      const data = await response.json()
      setCat(data)
      return response
    }

    async getCategoryById(id: number, setCategory: React.Dispatch<React.SetStateAction<CategoriesType>>) {
      const response = await fetch(`${API_URL}/api/categories/${id}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la catégorie')
      }
      const data = await response.json()
      setCategory(data)
      return response
    }

    async getPicturesByCategory(category: number) {
      const response = await fetch(`${API_URL}/api/uploads/${category}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des images')
      }
      return response
    }


    async updateCategory(id: number | undefined, selectedCategory: FormData) {
      const config = {
        method: 'PATCH',
        url: `${API_URL}/api/categories/${id}`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        data: selectedCategory,
      }
  
      return axios.request(config)
    }

    async deletePictureCategory(id: number, name: string) {
      const response = await fetch(`${API_URL}/api/uploads/${id}/${name}`, {
        method: 'DELETE',
      })
      return response
    }

    async deleteCategory(id: number) {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      })
      return response
    }

    async uploadPicture(file: FormData, categoryId: number) {
      const response = await fetch(`${API_URL}/api/uploads/${categoryId}`, {
        method: 'POST',
        body: file,
      })
      return response
    }
}

const categoriesServiceInstance = new CategoriesService();
export default categoriesServiceInstance;