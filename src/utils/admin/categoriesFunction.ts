import categoriesServiceInstance from "@/services/CategoriesServices";
import {
  CategoriesResultType,
  DebouncedFilterCategoriesType,
} from "@/types/CategoriesType";
import React from "react";
import { NavigateFunction } from "react-router-dom";

export const debouncedCategoriesFilterSetter = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterCategoriesType,
) => {
  if (debouncedFilters.page) params.set("page", debouncedFilters.page);
  if (debouncedFilters.perPage) params.set("perPage", debouncedFilters.perPage);
  if (debouncedFilters.id) params.set("id", debouncedFilters.id);
  if (debouncedFilters.name) params.set("name", debouncedFilters.name);
  if (debouncedFilters.store) params.set("store", debouncedFilters.store);
};

export const getPaginatedCategories = async (
  page: string,
  perPage: string,
  id: string,
  name: string,
  store: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedCategories: React.Dispatch<
    React.SetStateAction<CategoriesResultType>
  >,
) => {
  setIsLoading(true);
  try {
    const response = await categoriesServiceInstance.paginatedCategories(
      page,
      perPage,
      id,
      name,
      store,
    );
    setPaginatedCategories(response);
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export const getFilteredCategoriesData = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterCategoriesType,
  navigate: NavigateFunction,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedCategories: React.Dispatch<
    React.SetStateAction<CategoriesResultType>
  >,
) => {
  debouncedCategoriesFilterSetter(params, debouncedFilters);
  getPaginatedCategories(
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.id,
    debouncedFilters.name,
    debouncedFilters.store,
    setIsLoading,
    setPaginatedCategories,
  );
  navigate(`/tableau-de-bord/categories?${params.toString()}`);
};
