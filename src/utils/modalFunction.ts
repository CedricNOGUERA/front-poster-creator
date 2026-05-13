import { StoresType } from "@/types/StoresType";
import React from "react";
import { getPaginatedUsers } from "./admin/function";
import { ResultUserType, UserType } from "@/types/UserType";

//////////////////////////
//Store page
//////////////////////////
export const _handleShowAddModal = (
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setShowAddModal(true);
};
export const _handleCloseAddModal = (
  setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>,
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setSelectedItem({} as StoresType);
  setShowAddModal(false);
};

export const _handleShowEditModal = (
  setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>,
  selectedItem: StoresType,
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setSelectedItem(selectedItem);
  setShowEditModal(true);
};

export const _handleCloseEditModal = (
  setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>,
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setSelectedItem({} as StoresType);
  setShowEditModal(false);
};

export const _handleShowDeleteModal = (
  setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>,
  selectedItem: StoresType,
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setSelectedItem(selectedItem);
  setShowDeleteModal(true);
};

export const _handleCloseDeleteModal = (
  setSelectedItem: React.Dispatch<React.SetStateAction<StoresType>>,
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setSelectedItem({} as StoresType);
  setShowDeleteModal(false);
};

///////////////////////
// User Page
///////////////////////

export const handleCloseDeleteUser = (
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>,
) => setShowDelete(false);
export const handleShowDeleteUser = (
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>,
) => setShowDelete(true);

export const handleCloseAddUser = (
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType | null>>,
      page: string,
      perPage: string,
      company: string,
      store: string,
      name: string,
      email: string,
      role: string,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>> ,
      setPaginatedUsers: React.Dispatch<React.SetStateAction<ResultUserType>>
) => {
  setShowAdd(false);
  setSelectedUser({} as UserType);
    getPaginatedUsers(
      page,
      perPage,
      company,
      store,
      name,
      email,
      role,
      setIsLoading,
      setPaginatedUsers,
    );
};

export const handleShowAddUser = (
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType>>,
) => {
  setSelectedUser({} as UserType);
  setShowAdd(true);
};

export const handleShowEditUser = (
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType>>,
  user: UserType,
) => {
  setSelectedUser(user);
  setShowAdd(true);
};
