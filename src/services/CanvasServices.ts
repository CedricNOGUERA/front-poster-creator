import { Canvastype } from "@/types/CanvasType";

class CanvasService {
  async postCanvas(newCanvas: Canvastype) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/add-canvas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCanvas),
      }
    );
    return response;
  }

  async deleteCanvas(canvasId: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/canvases/${canvasId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  }
}

const canvasServiceInstance = new CanvasService();
export default canvasServiceInstance;
