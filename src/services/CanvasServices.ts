import { Canvastype } from "@/types/CanvasType";

const API_URL = import.meta.env.VITE_API_URL

class CanvasService {

    async postCanvas(newCanvas: Canvastype) {
    const response = await fetch('http://localhost:8081/api/add-canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCanvas),
      });
      return response
    }

    async deleteCanvas(canvasId: string){
      const response = await fetch(`${API_URL}/api/canvases/${canvasId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
      })
      return response
    }

}

const canvasServiceInstance = new CanvasService();
export default canvasServiceInstance;