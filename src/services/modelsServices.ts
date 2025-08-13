//

import { ComponentTypeMulti } from "@/types/ComponentType";
import * as htmlToImage from 'html-to-image'
// import { ModelType } from "@/types/modelType"

class ModelsService {
  async postModel(formData: FormData) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/add-model`,
      {
        method: "POST",
        body: formData,
      }
    );

    return response;
  }

  async getModels() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/models`);
    return response;
  }

  async putModels(id: number, formData: FormData) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/update-models/${id}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response;
  }

  async patchModel(modelId: number, formData: ComponentTypeMulti[]) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/patch-models/${modelId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: JSON.stringify({ canvas: formData }) }),
      }
    );
    return response;
  }

  async deleteModel(modelId: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/models/${modelId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  }


  formattedModelPicture(name: string){
    const formattedImage = name
    .normalize('NFD') // transforme é → e + ́
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-zA-Z0-9]/g, '-') //transforme les espaces en -
    .toLowerCase()

  const imageName = formattedImage + '.png'
  return imageName
  }

  async miniatureModel(posterRef: React.RefObject<HTMLDivElement | null>) {
    const canvasElement = posterRef.current
    if (!canvasElement) return
    
    const blob = await htmlToImage.toBlob(canvasElement)
    if (!blob) {
      console.error("Erreur de génération de l'image")
      return
    }else {
      return blob
    }
  }

}

const modelsServiceInstance = new ModelsService();
export default modelsServiceInstance;
