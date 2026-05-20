import { UserDataType } from "@/stores/userDataStore";
import { ComponentTypeMulti } from "./ComponentType";
import { ShopType } from "./ShopType";
import React from "react";
import { FeedBackSatateType } from "./DiversType";

export type CategoriesType = {
  id?: number;
  name: string;
  image: string;
  imageRglt: string | null;
  icon: { name: string; value: string };
  shopIds: number[];
  canvasId: number;
  canvas: ComponentTypeMulti[];
};

export type CategoriesPaginatedType = {
  categories: CategoriesType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number;
    previousPage: number;
  };
};

export interface CategoriesResultType {
  total: number;
  page: number;
  perPage: number;
  offset: number;
  categories: CategoriesType[];
}

export interface DebouncedFilterCategoriesType {
  page: string;
  perPage: string;
  id: string;
  name: string;
  store: string;
}

export type FormCategoryDataType = {
  name: string;
  icon: { name: string; value: string };
  image: string;
  imageRglt: string;
  backgroundColorHeader: string;
  backgroundColorBody: string;
  shopIds: number[];
  canvas: ComponentTypeMulti[];
};

export interface CategoriesHookType {
  userData: UserDataType;
  userRole: "super_admin" | "admin" | "user";
  columnsData: string[];
  selectedCategory: CategoriesType;
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoriesType>>;
  isLoading: boolean;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  imgRglt: File | null;
  setImgRglt: React.Dispatch<React.SetStateAction<File | null>>;
  paginatedCategories: CategoriesResultType;
  setPaginatedCategories: React.Dispatch<
    React.SetStateAction<CategoriesResultType>
  >;
  showAddEditModal: boolean;
  setShowAddEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDuplicate: boolean;
  setShowDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  isFiltering: boolean;
  totalPages: number;
  currentPage: number;
  shops: ShopType[];
  feedBackState: FeedBackSatateType;
  selectedCategoryId: number | null;
  trigger: string | undefined;

  //Filters
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  perPage: string;
  setPerPage: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  store: string;
  setStore: React.Dispatch<React.SetStateAction<string>>;

  //handlers
  handleShowEditModal: (category: CategoriesType) => void;
  handleShowDuplicate: (category: CategoriesType) => void;
  handleCloseDuplicate: () => void;
  handleCloseAddEditModal: () => void;
  handleShowDeleteModal: (id: number) => void;
  handleCloseDeleteModal: () => void;
  handleUpdateCategory: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteCategory: () => void;
  shopDisplay: (
    shopData: ShopType[],
    shop: number,
    indx: number,
    category: CategoriesType,
  ) => string | undefined;
}

export interface CategorySelectorHookType {
  categories: CategoriesType[];
  formData: FormCategoryDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormCategoryDataType>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setImgRglt: React.Dispatch<React.SetStateAction<File | null>>;
  feedBackState: {
    isLoading: boolean;
    loadingMessage: string;
    isError: boolean;
    errorMessage: string;
  };
  showAdd: boolean;
  validated: boolean;
  fieldErrors: {
    [key: string]: string;
  };
  validateField: (fieldName: string, value: string) => void;
  handleCloseAdd: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onHandleCategory: (id: number) => void;
  handleShowAdd: () => void;
}
