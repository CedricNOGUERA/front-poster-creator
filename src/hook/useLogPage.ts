/* eslint-disable react-hooks/exhaustive-deps */
import { DebouncedFilterLogType, LogResultType } from "@/types/logType";
import { getFilteredLogData } from "@/utils/admin/logsFunction";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function() {

      const [params] = useSearchParams();
      const navigate = useNavigate();
    
      const columnsData = ["Id", "Utilisateur", "Gravité", "Route", "Message", "Date", ""];
      const [logs, setLogs] = React.useState<LogResultType>({} as LogResultType);
      const [isLoading, setIsLoading] = React.useState<boolean>(false);
      const [page, setPage] = React.useState<string>(params.get("page") || "1");
      const [perPage, setPerPage] = React.useState<string>(
        params.get("perPage") || "10",
      );
      const [route, setRoute] = React.useState<string>(params.get("route") || "");
      const [level, setLevel] = React.useState<string>(params.get("level") || "");
      const [user, setUser] = React.useState<string>(params.get("user") || "");
      const [message, setMessage] = React.useState<string>(
        params.get("message") || "",
      );
      const [createdAt, setCreatedAt] = React.useState<string>(
        params.get("createdAt") || "",
      );

      const filters = { page, perPage, route, level, user, message, createdAt };

      const isFiltering = [route, level, user, message, createdAt].every((v) => v === "");

      
      
      const totalPages = Math.ceil(logs?.total / parseInt(perPage));
      const currentPage = parseInt(page);
      
      const [debouncedFilters, setDebouncedFilters] = React.useState<DebouncedFilterLogType>(filters);
    
    React.useEffect(() => {
        const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
        return () => clearTimeout(timeout);
      }, [page, perPage, route, level, user, message, createdAt]);

      // Fetch
        React.useEffect(() => {
          const params = new URLSearchParams();
          getFilteredLogData(
            params,
            debouncedFilters,
            navigate,
            setIsLoading,
            setLogs,
          );
        }, [debouncedFilters, navigate]);

        console.log(level)
    
    return{

        //States
        columnsData, logs, isLoading, isFiltering, totalPages, currentPage,
        //Filters
        page, setPage, perPage, setPerPage,
        route, setRoute, level, setLevel,
        user, setUser, message, setMessage,
        createdAt, setCreatedAt
    }
}