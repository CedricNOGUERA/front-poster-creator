import { DimensionFormDataType } from "@/types/ModalType";

const api_url = import.meta.env.VITE_API_URL

class DimensionsService {
    async getDimensions() {
        const response = await fetch(`${api_url}/api/dimensions`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur s'est produite lors de la récupération des dimensions");
        }

        return response.json();
    }

    async postDimension(dimensionData: DimensionFormDataType) {
        const response = await fetch(`${api_url}/api/dimensions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(dimensionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur s'est produite lors de la création de la dimension");
        }

        return response.json();
    }

    async patchDimsensionStatus(id: number, newStatus: boolean | null) {
        const response = await fetch(`${api_url}/api/dimensions/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur s'est produite lors de la mise à jour du statut");
        }

        return response.json();
    }

}

const dimensionsServiceInstance = new DimensionsService();
export default dimensionsServiceInstance;