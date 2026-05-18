import logServiceInstance from "@/services/LogService";
import { LogResultType } from "@/types/logType";






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