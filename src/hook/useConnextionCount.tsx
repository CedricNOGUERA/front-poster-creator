/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  ConnexionStatType,
  DebouncedFilterConnexionType,
} from "@/types/ConnextionStatType";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getFilteredConnexionData,
} from "@/utils/admin/connexionFunction";
import userDataStore, { UserDataType } from "@/stores/userDataStore";

export function useConnexionCount() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const userRole = userDataStore((state: UserDataType) => state.role);

  const [connexions, setConnexions] = React.useState<ConnexionStatType>(
    {} as ConnexionStatType,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "20",
  );
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [email, setEmail] = React.useState<string>(params.get("email") || "");
  const [company, setCompany] = React.useState<string>(
    params.get("company") || "",
  );
  const [connectedAt, setConnectedAt] = React.useState<string>(
    params.get("connectedAt") || "",
  );

  const filters = { page, perPage, name, email, company, connectedAt };

  const isFiltering = [page, perPage, name, email, company, connectedAt].every(
    (v) => v === "",
  );
  const totalPages = Math.ceil(connexions?.total / parseInt(perPage));

  // Redirection user
  React.useEffect(() => {
    if (userRole === "user") navigate("/editeur-de-bon-plan");
  }, [userRole, navigate]);

  // Debounce
  const [debouncedFilters, setDebouncedFilters] =
    React.useState<DebouncedFilterConnexionType>(filters);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, name, email, company, connectedAt]);

  // Fetch
  React.useEffect(() => {
    const urlParams = new URLSearchParams();
    getFilteredConnexionData(
      urlParams,
      debouncedFilters,
      navigate,
      setIsLoading,
      setConnexions,
    );
  }, [debouncedFilters, navigate]);

  return {
    //states
    connexions,
    isLoading,
    isFiltering,
    userRole,
    totalPages,
    currentPage: parseInt(page),
    //filtres
    page,
    setPage,
    perPage,
    setPerPage,
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    connectedAt,
    setConnectedAt,
    //handlers
  };
}
