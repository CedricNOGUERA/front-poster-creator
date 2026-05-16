import UsersServices from "@/services/UsersServices";
import { DebouncedFilterType, ResultUserType } from "@/types/UserType";
import React from "react";
import { NavigateFunction } from "react-router-dom";

export const createResetForm = (
  setters: Record<string, React.Dispatch<React.SetStateAction<string>>>,
  // setters: Record<string, (value: string) => void>,
) => {
  return () => {
    Object.values(setters).forEach((setter) => setter(""));
  };
};

export const debouncedFilterSetter = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterType,
) => {
  if (debouncedFilters.page) params.set("page", debouncedFilters.page);
  if (debouncedFilters.perPage) params.set("perPage", debouncedFilters.perPage);
  if (debouncedFilters.company) params.set("company", debouncedFilters.company);
  if (debouncedFilters.store) params.set("store", debouncedFilters.store);
  if (debouncedFilters.name) params.set("name", debouncedFilters.name);
  if (debouncedFilters.email) params.set("email", debouncedFilters.email);
  if (debouncedFilters.role) params.set("role", debouncedFilters.role);
};

export const getPaginatedUsers = async (
  page: string,
  perPage: string,
  company: string,
  store: string,
  name: string,
  email: string,
  role: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedUsers: React.Dispatch<React.SetStateAction<ResultUserType>>,
) => {
  setIsLoading(true);

  try {
    const response = await UsersServices.paginatedUsers(
      page,
      perPage,
      company,
      store,
      name,
      email,
      role,
    );

    setPaginatedUsers(response);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export const getFilteredUserData = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterType,
  navigate: NavigateFunction,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedUsers: React.Dispatch<React.SetStateAction<ResultUserType>>,
) => {
  debouncedFilterSetter(params, debouncedFilters);

  getPaginatedUsers(
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.company,
    debouncedFilters.store,
    debouncedFilters.name,
    debouncedFilters.email,
    debouncedFilters.role,
    setIsLoading,
    setPaginatedUsers,
  );

  navigate(`/tableau-de-bord/utilisateurs?${params.toString()}`);
};


