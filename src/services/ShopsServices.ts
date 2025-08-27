import { ShopType } from "@/types/ShopType"
import axios from "axios"
import React from "react"

const API_URL = import.meta.env.VITE_API_URL

class ShopsServices {
  async getShopFetch(setShops: React.Dispatch<React.SetStateAction<ShopType[]>>) {
    const response = await fetch(`${API_URL}/api/shops`)
    const data = await response.json()
    setShops(data)
    return response
  }
  async getShops() {

    const config = {
      method: 'GET',
      url: `${import.meta.env.VITE_API_URL}/api/shops`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    return axios.request(config)
  }
  async addShop(newShop: FormData) {
    const response = await fetch(`${API_URL}/api/add-shop`, {
      method: 'POST',
      body: newShop,
    })
    return response
  }

  async deleteShop(shopId: number) {
    const response = await fetch(`${API_URL}/api/shops/${shopId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    return response
  }
}

const shopServiceInstance = new ShopsServices();

export default shopServiceInstance