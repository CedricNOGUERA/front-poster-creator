import modelsServiceInstance from "@/services/modelsServices";
import { DebouncedFilterModelType, ModelResultType } from "@/types/modelType";
import { NavigateFunction } from "react-router-dom";

export const debouncedModelFilter = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterModelType,
) => {
  if (debouncedFilters.page) params.set("page", debouncedFilters.page);
  if (debouncedFilters.perPage) params.set("perPage", debouncedFilters.perPage);
  if (debouncedFilters.id) params.set("id", debouncedFilters.id);
  if (
    debouncedFilters.template !== "template" &&
    debouncedFilters.template !== ""
  )
    params.set("template", debouncedFilters.template);
  if (
    debouncedFilters.dimension !== "dimensions" &&
    debouncedFilters.dimension !== ""
  )
    params.set("dimension", debouncedFilters.dimension);
};

export const getPaginatedModels = async (
  page: string,
  perPage: string,
  id: string,
  template: string,
  dimension: string,
  status: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedModels: React.Dispatch<React.SetStateAction<ModelResultType>>,
) => {
  setIsLoading(true);
  try {
    const response = await modelsServiceInstance.getPaginatedModels(
      page,
      perPage,
      id,
      template,
      dimension,
      status
    );
    setPaginatedModels(response);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export const getFilteredModelData = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterModelType,
  navigate: NavigateFunction,
  setIsLoadingDisplay: React.Dispatch<React.SetStateAction<boolean>>,
  setPaginatedModels: React.Dispatch<React.SetStateAction<ModelResultType>>,
) => {
  debouncedModelFilter(params, debouncedFilters);
  getPaginatedModels(
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.id,
    debouncedFilters.template,
    debouncedFilters.dimension,
    debouncedFilters.status,
    setIsLoadingDisplay,
    setPaginatedModels,
  );
  navigate(`/tableau-de-bord/modeles?${params.toString()}`);
};


export const changeStatusModel = async (id: number, status: boolean | undefined, closeModal: ()=> void) => {

  try{
    const response = await modelsServiceInstance.patchStatusModel(id, !status)

    console.warn(response)
    closeModal()

  }catch(error){
    console.error(error)
  }
}
