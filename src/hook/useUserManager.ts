import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import UsersServices from "@/services/UsersServices";
import { ResultUserType, UserType, DebouncedFilterType } from "@/types/UserType";
import { getFilteredUserData, getPaginatedUsers } from "@/utils/admin/function";

export function useUserManager() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const userRole = userDataStore((state: UserDataType) => state.role);
  const userCompany = userDataStore((state: UserDataType) => state.company);

  const [paginatedUsers, setPaginatedUsers] = React.useState<ResultUserType>({} as ResultUserType);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [page, setPage] = React.useState(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState(params.get("perPage") || "10");
  const [company, setCompany] = React.useState(params.get("company") || "");
  const [store, setStore] = React.useState(params.get("store") || "");
  const [name, setName] = React.useState(params.get("name") || "");
  const [email, setEmail] = React.useState(params.get("email") || "");
  const [role, setRole] = React.useState(params.get("role") || "");

  const filters = { page, perPage, company, store, name, email, role };

  const isFiltering = [company, store, name, email, role].every((v) => v === "");
  const totalPages = Math.ceil(paginatedUsers?.total / parseInt(perPage));

  const refreshUsers = () =>
    getPaginatedUsers(page, perPage, company, store, name, email, role, setIsLoading, setPaginatedUsers);

  // Redirection user
  React.useEffect(() => {
    if (userRole === "user") navigate("/editeur-de-bon-plan");
  }, [userRole, navigate]);

  // Debounce
  const [debouncedFilters, setDebouncedFilters] = React.useState<DebouncedFilterType>(filters);
  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, company, store, name, email, role]);

  // Fetch
  React.useEffect(() => {
    const urlParams = new URLSearchParams();
    getFilteredUserData(urlParams, debouncedFilters, navigate, setIsLoading, setPaginatedUsers);
  }, [debouncedFilters, navigate]);

  const handleCloseAdd = () => {
    setShowAdd(false);
    setSelectedUser(null);
    refreshUsers();
  };

  const handleShowEdit = (user: UserType) => {
    setSelectedUser(user);
    setShowAdd(true);
  };

  const deleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await UsersServices.deleteUser(id);
      if (response.ok) refreshUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowDelete(false);
    }
  };

  return {
    // state
    paginatedUsers, isLoading, isFiltering,
    showAdd, showDelete, setShowDelete,
    selectedUser, selectedUserId, setSelectedUserId,
    userRole, userCompany,
    totalPages, currentPage: parseInt(page),
    // filtres
    page, setPage, perPage, setPerPage,
    company, setCompany, store, setStore,
    name, setName, email, setEmail, role, setRole,
    // handlers
    handleCloseAdd,
    handleShowAdd: () => { setSelectedUser(null); setShowAdd(true); },
    handleShowEdit,
    handleShowDelete: () => setShowDelete(true),
    handleCloseDelete: () => setShowDelete(false),
    deleteUser,
  };
}