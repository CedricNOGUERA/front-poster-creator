/* eslint-disable react-hooks/exhaustive-deps */
import storeServiceInstance from "@/services/StoreServices";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import {
  DebouncedFilterStoreType,
  ResultStoreType,
  StoresType,
} from "@/types/StoresType";
import {
  getFilteredStoreData,
  getPaginatedStores,
} from "@/utils/admin/storeFunction";
import {
  _handleCloseAddModal,
  _handleCloseDeleteModal,
  _handleCloseEditModal,
} from "@/utils/modalFunction";
import React from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

interface ContextStoreType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export function useStorePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const userRole = userDataStore((state: UserDataType) => state.role);
  const { toggleShow, setToastData } =
    useOutletContext<ContextStoreType>();

    const [paginatedStores, setPaginatedStores] = React.useState<ResultStoreType>(
      {} as ResultStoreType,
    );
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoadingDisplay, setIsLoadingDisplay] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedStore, setSelectedStore] = React.useState<StoresType>(
    {} as StoresType,
  );
  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "20",
  );
  const [id, setId] = React.useState<string>(params.get("id") || "");
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [company, setCompany] = React.useState<string>(
    params.get("company") || "",
  );
  const filters = { page, perPage, id, name, company }

  const isFiltering = [company, id, name, company].every((v) => v === "");
  const totalPages = Math.ceil(paginatedStores?.total / parseInt(perPage));

  // Redirection user
  React.useEffect(() => {
    if (userRole === "user") navigate("/editeur-de-bon-plan");
  }, [userRole, navigate]);

  // Debounce
  const [debouncedFilters, setDebouncedFilters] =
    React.useState<DebouncedFilterStoreType>(filters);
    
  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, company, id, name, company]);

  // Fetch
  React.useEffect(() => {
    const urlParams = new URLSearchParams();
    getFilteredStoreData(
      urlParams,
      debouncedFilters,
      navigate,
      setIsLoading,
      setPaginatedStores,
    );
  }, [debouncedFilters, navigate]);

  const addStore = async () => {
    setIsLoading(true);
    const storeFormData = {
      name: selectedStore.name,
      companyId: selectedStore.companyId,
    };
    try {
      await storeServiceInstance.createStore(storeFormData);

      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
        setIsLoadingDisplay,
        setPaginatedStores,
      );
      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin créé avec succès !",
      });
      toggleShow();
      _handleCloseAddModal(setSelectedStore, setShowAddModal);
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message:
          "Une erreur s'est produite lors de la création du magasin. Veuillez Réessayer",
      });
      toggleShow();
    } finally {
      setIsLoading(false);
    }
  };

  const updateStore = async (id: number, data: Partial<StoresType>) => {
    setIsLoading(true);
    try {
      await storeServiceInstance.patchStore(id, data);

      _handleCloseEditModal(setSelectedStore, setShowEditModal);
      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
        setIsLoadingDisplay,
        setPaginatedStores,
      );
      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin modifiée avec succès !",
      });
      toggleShow();
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message: `Une erreur s'est produite lors de la modification du magasin. Veuillez Réessayer`,
      });
      toggleShow();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStore = async (id: number) => {
    setIsLoading(true);
    try {
      await storeServiceInstance.deleteStore(id);

      _handleCloseDeleteModal(setSelectedStore, setShowDeleteModal);
      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
        setIsLoadingDisplay,
        setPaginatedStores,
      );
      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin supprimé avec succès !",
      });
      toggleShow();
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message: `Une erreur s'est produite lors de la suppression du magasin`,
      });
      toggleShow();
    } finally {
      setIsLoading(true);
    }
  };

  return {
    //states
    paginatedStores, isLoadingDisplay, isFiltering,
    showAddModal, showDeleteModal, showEditModal,
    setShowAddModal, setShowDeleteModal, setShowEditModal,
    selectedStore, setSelectedStore, 
    isLoading, userRole, totalPages, currentPage: parseInt(page),
    //filtres
    page, setPage, perPage, setPerPage,
    id, name, company,
    setId, setName, setCompany, 
    //handlers
    addStore, updateStore, deleteStore
  };
}
