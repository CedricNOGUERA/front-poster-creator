//

import { ComponentTypeMulti } from "@/types/ComponentType"

// import { ModelType } from "@/types/modelType"

const API_URL = import.meta.env.VITE_API_URL

class ModelsService {

    async postModel(formData: FormData){
      const response = await fetch(`${API_URL}/api/add-model`, {
        method: 'POST',
        body: formData,
      })

      return response
    }

    async getModels(){
      const response = await fetch('http://localhost:8081/api/models')
      return response
    }

    async putModels(id: number, formData: FormData){
      const response = await fetch(`${API_URL}/api/update-models/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
      })

      return response

    }

    async patchModel(modelId: number, formData: ComponentTypeMulti[]){
      const response = await fetch(`${API_URL}/api/patch-models/${modelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: formData
         body: JSON.stringify({canvas: formData})
      })
      return response
    }

    async deleteModel(modelId: string){
      const response = await fetch(`${API_URL}/api/models/${modelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
      })
      return response
    }
}

const modelsServiceInstance = new ModelsService();
export default modelsServiceInstance;