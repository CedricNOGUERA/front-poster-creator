import { StoresType } from "@/types/StoresType";
import React from "react";

//////////////////////////
//Store page
//////////////////////////
export const _handleShowAddModal = (setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShowAddModal(true)
};
export const _handleCloseAddModal = (setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>, setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    setSelectedItem({} as StoresType);
    setShowAddModal(false)
};


export const _handleShowEditModal = (setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>, selectedItem: StoresType, setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    setSelectedItem(selectedItem);
    setShowEditModal(true);
  };

 export const _handleCloseEditModal = (setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>, setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>) => {
      setSelectedItem({} as StoresType);
      setShowEditModal(false);
  };

 export const _handleShowDeleteModal = (setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>, selectedItem: StoresType, setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    setSelectedItem(selectedItem);
    setShowDeleteModal(true);
  };

 export const _handleCloseDeleteModal = (setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>, setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>) => {
      setSelectedItem({} as StoresType);
      setShowDeleteModal(false);
  };