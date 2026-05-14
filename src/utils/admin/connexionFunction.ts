import StatServices from "@/services/StatServices";
import { ConnexionStatType, DebouncedFilterConnexionType } from "@/types/ConnextionStatType";
import { NavigateFunction } from "react-router-dom";


export const debouncedConnexionFilterSetter = (
  params: URLSearchParams,
  debouncedFilters: DebouncedFilterConnexionType,
) => {
  if (debouncedFilters.page) params.set("page", debouncedFilters.page);
  if (debouncedFilters.perPage) params.set("perPage", debouncedFilters.perPage);
  if (debouncedFilters.name) params.set("name", debouncedFilters.name);
  if (debouncedFilters.email) params.set("email", debouncedFilters.email);
  if (debouncedFilters.company) params.set("company", debouncedFilters.company);
  if (debouncedFilters.connectedAt) params.set("connectedAt", debouncedFilters.connectedAt);
};



export const getPaginatedConnexions = async (
  page: string,
  perPage: string,
  name: string,
  email: string,
  company: string,
  connectedAt: string,
  setConnexions: React.Dispatch<React.SetStateAction<ConnexionStatType>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsLoading(true);
  try {
    const response = await StatServices.paginatedConnexion(
      page,
      perPage,
      name,
      email,
      company,
      connectedAt,
    );
    setConnexions(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs paginés:", error);
  } finally {
    setIsLoading(false);
  }
};


export const getFilteredConnexionData = (
    params: URLSearchParams,
      debouncedFilters: DebouncedFilterConnexionType,
      navigate: NavigateFunction,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setConnexions: React.Dispatch<React.SetStateAction<ConnexionStatType>>,
) => {
    debouncedConnexionFilterSetter(params, debouncedFilters);
    getPaginatedConnexions(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.name,
      debouncedFilters.email,
      debouncedFilters.company,
      debouncedFilters.connectedAt,
      setConnexions,
      setIsLoading,
    );

    navigate(`/tableau-de-bord/connexions?${params.toString()}`)
}
