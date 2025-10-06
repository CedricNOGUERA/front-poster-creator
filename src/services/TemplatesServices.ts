import { TemplateType } from '@/types/TemplatesType'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

class TemplatesServices {
  async getTemplates(setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>) {
    const response = await fetch(`${API_URL}/api/templates`)
    const data = await response.json()
    setTemplates(data)
    return response
  }
  async getTemplate(
    setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>,
    categoryId: number
  ) {
    const response = await fetch(`${API_URL}/api/templates`)
    const data = await response.json()
    const filetredTemplate = data.filter(
      (temp: TemplateType) => temp.categoryId === categoryId
    )
    setTemplates(filetredTemplate)
    return response
  }

  async postTemplate(newTemplate: TemplateType) {
    const response = await fetch(`${API_URL}/api/add-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTemplate),
    })
    return response
  }

  // async patchTemplates(id: number | undefined, data: TemplateType) {
  //   const response = await fetch(`${API_URL}/api/templates/${id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     body: JSON.stringify(data),
  //   })

  //   return response
  // }
  async patchTemplates(id: number | undefined, data: TemplateType) {
    const response = await axios.patch(
      `${API_URL}/api/templates/${id}`,
      data,
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
  
    return response
  }


  async postImageTemplate(newImageTemplate: FormData) {
    const response = await fetch(`${API_URL}/api/add-images-template`, {
      method: 'POST',
      body: newImageTemplate,
    })
    return response
  }

  async patchImageTemplate(id: number, imageName: string, formData: FormData) {

    const response = await fetch(`${API_URL}/api/template/${id}/thumbnail/${imageName}`, {
      method: 'PATCH',
      body: formData
    })

    return response
  }

  async deleteTemplate(templateId: number | undefined) {
    if (!templateId) return
    const response = await fetch(`${API_URL}/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response
  }
}

const templatesServiceInstance = new TemplatesServices()
export default templatesServiceInstance
