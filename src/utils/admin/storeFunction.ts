import storeServiceInstance from "@/services/StoreServices";
import { DebouncedFilterStoreType, ResultStoreType } from "@/types/StoresType";
import { NavigateFunction } from "react-router-dom";

export const debouncedStoreFilterSetter = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterStoreType,
) => {
  if (debouncedFilters.page) params.set("page", debouncedFilters.page);
  if (debouncedFilters.perPage) params.set("perPage", debouncedFilters.perPage);
  if (debouncedFilters.id) params.set("id", debouncedFilters.id);
  if (debouncedFilters.name) params.set("name", debouncedFilters.name);
  if (debouncedFilters.company) params.set("company", debouncedFilters.company);
};

export const getPaginatedStores = async (
  page: string,
  perPage: string,
  id: string,
  name: string,
  company: string,
  setIsLoadingDisplay: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedStores: React.Dispatch<React.SetStateAction<ResultStoreType>>,
) => {
  setIsLoadingDisplay(true);

  try {
    const response = await storeServiceInstance.paginatedStores(
      page,
      perPage,
      id,
      name,
      company,
    );

    setPaginatedStores(response);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoadingDisplay(false);
  }
};

export const getFilteredStoreData = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterStoreType,
  navigate: NavigateFunction,
  setIsLoadingDisplay: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedStores: React.Dispatch<React.SetStateAction<ResultStoreType>>,
) => {
  debouncedStoreFilterSetter(params, debouncedFilters);
  getPaginatedStores(
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.id,
    debouncedFilters.name,
    debouncedFilters.company,
    setIsLoadingDisplay,
    setPaginatedStores,
  );
  navigate(`/tableau-de-bord/magasins?${params.toString()}`);
};
