import axios from 'axios';
import html2canvas from 'html2canvas';

const api_url = import.meta.env.VITE_API_URL

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

  async getPaginatedModels(
    page: string,
    perPage: string,
    id: string,
    template: string,
    dimension: string,
    status: string,
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      perPage: `${perPage}`,
      id: `${id}`,
      template: `${template}`,
      dimension: `${dimension}`,
      status: `${status}`,
    });
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/models/paginated?${params.toString()}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.json();
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response;

    // return response;
  }

  async patchStatusModel(id: number, activated: boolean) {
    const response = await fetch(`${api_url}/api/models/${id}/status`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ activated }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur de mise à jour du statut");
    }

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

  formattedModelPicture(name: string | undefined) {
    if (!name) return "";
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
    } else {
      return blob;
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
