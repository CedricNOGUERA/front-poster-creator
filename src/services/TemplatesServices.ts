import { TemplateType } from '@/types/TemplatesType'

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
  async postImageTemplate(newImageTemplate: FormData) {
    const response = await fetch(`${API_URL}/api/add-images-template`, {
      method: 'POST',
      body: newImageTemplate,
    })
    return response
  }

  async deleteTemplate(templateId: number | undefined) {
    if (!templateId) return
    const response = await fetch(`${API_URL}/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    return response
  }
}

const templatesServiceInstance = new TemplatesServices()
export default templatesServiceInstance
