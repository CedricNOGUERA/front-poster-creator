import logServiceInstance from "@/services/LogService";
import { DebouncedFilterLogType, LogResultType } from "@/types/logType";
import { NavigateFunction } from "react-router-dom";


const debouncedLogsFilter = (
    params: URLSearchParams,
      debouncedFilters: DebouncedFilterLogType,
) => {
     if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.route) params.set("route", debouncedFilters.route);
    if (debouncedFilters.level) params.set("level", debouncedFilters.level);
    if (debouncedFilters.user) params.set("user", debouncedFilters.user);
    if (debouncedFilters.message)
      params.set("message", debouncedFilters.message);
    if (debouncedFilters.createdAt)
      params.set("createdAt", debouncedFilters.createdAt);
}



export const getPaginatedLogs = async (
    page: string,
    perPage: string,
    route: string,
    level: string,
    user: string,
    message: string,
    createdAt: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLogs: React.Dispatch<React.SetStateAction<LogResultType>>
  ) => {
    setIsLoading(true);
    try {
      const response = await logServiceInstance.paginatedLogs(
        page,
        perPage,
        route,
        level,
        user,
        message,
        createdAt,
      );
      setLogs(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des logs paginés:", error);
    } finally {
      setIsLoading(false);
    }
  };


export const getFilteredLogData = (
     params: URLSearchParams,
      debouncedFilters: DebouncedFilterLogType,
      navigate: NavigateFunction,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setLogs: React.Dispatch<React.SetStateAction<LogResultType>>,
) => {

    debouncedLogsFilter(params, debouncedFilters);
    getPaginatedLogs(
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.route,
    debouncedFilters.level,
    debouncedFilters.user,
    debouncedFilters.message,
    debouncedFilters.createdAt,
    setIsLoading,
    setLogs
    )
    navigate(`/tableau-de-bord/logs?${params.toString()}`)

}