import shopServiceInstance from "@/services/ShopsServices";
import { ShopType } from "@/types/ShopType";
import React from "react";


export const getAllShops = async (
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await shopServiceInstance.getShops();
    setShops(response.data);
  } catch (err) {
    console.error("Erreur lors de la récupération des magasins:", err);
  } finally {
    setIsLoading(false);
  }
};




