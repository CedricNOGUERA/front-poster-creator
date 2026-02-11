// import { ComponentTypeMulti } from "@/types/ComponentType";
// import { ImagemodelType } from '@/types/modelType';
import axios from 'axios';
import * as htmlToImage from 'html-to-image'
import html2canvas from 'html2canvas';
// import { ModelType } from "@/types/modelType"

class ModelsService {
  async postModel(formData: FormData) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/add-model`,
      {
        method: "POST",
        body: formData,
      },
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response;
  }

  async patchModel(modelId: number, formData: FormData) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/patch-models/${modelId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );
    return response;
  }

  async deleteModel(modelId: number) {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/models/${modelId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response;
  }

  formattedModelPicture(name: string) {
    const formattedImage = name
      .normalize("NFD") // transforme é → e + ́
      .replace(/[\u0300-\u036f]/g, "") // retire les accents
      .replace(/[^a-zA-Z0-9]/g, "-") //transforme les espaces en -
      .toLowerCase();

    const imageName = formattedImage + ".png";
    return imageName;
  }

  async miniatureModel(posterRef: React.RefObject<HTMLDivElement | null>) {
   
     const canvasElement = posterRef.current;
      if (!canvasElement) {
        console.error("Élément canvas non trouvé");
        return;
      }

      // ✅ Utiliser html2canvas au lieu de htmlToImage
      const canvas = await html2canvas(canvasElement, {
        useCORS: true, // ✅ Permet de charger les ressources externes
        allowTaint: true, // ✅ Permet de capturer même avec des ressources cross-origin
        backgroundColor: null, // Fond transparent si nécessaire
        scale: 2, // ✅ Améliore la qualité de l'image (2x la résolution)
        logging: false, // Désactive les logs de débogage
        removeContainer: true, // Nettoie après le rendu
        imageTimeout: 15000, // Timeout pour le chargement des images
        // onclone: (clonedDoc) => {
        //   // ✅ Optionnel : ajuster le style du document cloné si nécessaire
        //   const clonedElement = clonedDoc.querySelector(
        //     `[data-canvas-id="${modelId}"]`,
        //   );
        //   if (clonedElement) {
        //     // Ajuster les styles si nécessaire
        //   }
        // },
      });

      // ✅ Convertir le canvas en blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          1.0,
        ); // Qualité maximale
      });
     

      if (!blob) {
        console.error("Erreur de génération de l'image");
        return;
      }else{
        return blob
      }
  }

  async getModelImage() {
    const config = {
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/api/images-model`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    return axios.request(config);
  }


}

const modelsServiceInstance = new ModelsService();
export default modelsServiceInstance;
