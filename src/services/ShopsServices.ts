import { ShopType } from "@/types/ShopType"
import React from "react"

const API_URL = import.meta.env.VITE_API_URL

class ShopsServices {

    async getShops(setShops: React.Dispatch<React.SetStateAction<ShopType[]>>){
        const response = await fetch(`${API_URL}/api/shops`)
        const data = await response.json()
        setShops(data)
        return response
    }
    async addShop(newShop: FormData){
        const response = await fetch(`${API_URL}/api/add-shop`, {
            method: 'POST',
            body: newShop,
        })
            return response
    }

    async deleteShop(shopId: number){
        const response = await fetch(`${API_URL}/api/shops/${shopId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
        return response
    }

}

const shopServiceInstance = new ShopsServices();

export default shopServiceInstance