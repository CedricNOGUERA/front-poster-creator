/* eslint-disable react-hooks/exhaustive-deps */
import categoriesServiceInstance from "@/services/CategoriesServices";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import {
  CategoriesResultType,
  CategoriesType,
  DebouncedFilterCategoriesType,
} from "@/types/CategoriesType";
import { FeedBackSatateType, ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import {
  getFilteredCategoriesData,
  getPaginatedCategories,
} from "@/utils/admin/categoriesFunction";
import { _expiredSession, _showToast } from "@/utils/notifications";
import { AxiosError } from "axios";
import React from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

interface ContextSideBarType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  shops: ShopType[];
  feedBackState: FeedBackSatateType;
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>;
}

export default function useCategoriesPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const userRole = userDataStore((state: UserDataType) => state.role);
  const userData = userDataStore((state: UserDataType) => state);
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout);

  const { toggleShow, setToastData, shops, feedBackState, setFeedBackState } =
    useOutletContext<ContextSideBarType>();
  const columnsData = ["ID", "Nom", "Image", "Magasins", "Actions"];
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoriesType>({} as CategoriesType);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [imgRglt, setImgRglt] = React.useState<File | null>(null);
  const [newName, setNewName] = React.useState<string>("");

  const [paginatedCategories, setPaginatedCategories] =
    React.useState<CategoriesResultType>({} as CategoriesResultType);

  const [showAddEditModal, setShowAddEditModal] =
    React.useState<boolean>(false);
  const [showDuplicate, setShowDuplicate] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "20",
  );
  const [id, setId] = React.useState<string>(params.get("id") || "");
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [store, setStore] = React.useState<string>(params.get("store") || "");

  const path = window.location.pathname;
  const trigger = path.split("/").filter(Boolean).pop();

  const filters = { page, perPage, id, name, store };

  const isFiltering = [id, name, store].every((v) => v === "");
  const totalPages = Math.ceil(paginatedCategories?.total / parseInt(perPage));

  // Debounce
  const [debouncedFilters, setDebouncedFilters] =
    React.useState<DebouncedFilterCategoriesType>(filters);

  // Redirection user
  React.useEffect(() => {
    if (userRole === "user") navigate("/editeur-de-bon-plan");
  }, [userRole, navigate]);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, store, id, name, store]);

  // Fetch
  React.useEffect(() => {
    const params = new URLSearchParams();
    getFilteredCategoriesData(
      params,
      debouncedFilters,
      navigate,
      setIsLoading,
      setPaginatedCategories,
    );
  }, [debouncedFilters, navigate]);

  const handleCloseDuplicate = () => {
    setSelectedCategory({} as CategoriesType);
    setShowDuplicate(false);
  };
  const handleShowDuplicate = (category: CategoriesType) => {
    setSelectedCategory(category);
    setShowDuplicate(true);
  };

  const handleShowEditModal = (category: CategoriesType) => {
    setSelectedCategory(category);
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setSelectedCategory({} as CategoriesType);
  };

  const handleShowDeleteModal = (id: number) => {
    setSelectedCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCategory({} as CategoriesType);
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setFeedBackState({
      isLoading: true,
      loadingMessage: "Modification en cours...",
      isError: false,
      errorMessage: "",
    });
    const { id, ...dataWithoutId } = selectedCategory;
    const formData = new FormData();
    formData.append("data", JSON.stringify(dataWithoutId));
    if (file) {
      formData.append("image", file);
    }
    if (imgRglt) {
      formData.append("imageRglt", imgRglt);
    }
    try {
      const updateResponse = await categoriesServiceInstance.updateCategory(
        id,
        formData,
      );

      if (updateResponse.status === 200) {
        getPaginatedCategories(
          debouncedFilters.page,
          debouncedFilters.perPage,
          debouncedFilters.id,
          debouncedFilters.name,
          debouncedFilters.store,
          setIsLoading,
          setPaginatedCategories,
        );
        handleCloseAddEditModal();
        setToastData({
          bg: "success",
          position: "top-end",
          delay: 3000,
          icon: "fa fa-check-circle",
          message: "Catégorie modifiée avec succès !",
        });
        toggleShow();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Erreur lors de la modification de la catégorie:", error);
        if (
          error?.response?.data.code === "TOKEN_EXPIRED" &&
          error.status === 401
        )
          _expiredSession(
            (success: boolean, message: string, delay: number) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
      }
    } finally {
      setFeedBackState({
        isLoading: false,
        loadingMessage: "",
        isError: false,
        errorMessage: "",
      });
    }
  };
  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    setFeedBackState({
      isLoading: true,
      loadingMessage: "Suppression en cours...",
      isError: false,
      errorMessage: "",
    });
    setIsLoading(true);
    try {
      const response =
        await categoriesServiceInstance.deleteCategory(selectedCategoryId);
      if (response.status === 200) {
        handleCloseDeleteModal();
        getPaginatedCategories(
          debouncedFilters.page,
          debouncedFilters.perPage,
          debouncedFilters.id,
          debouncedFilters.name,
          debouncedFilters.store,
          setIsLoading,
          setPaginatedCategories,
        );
        setToastData({
          bg: "success",
          position: "top-end",
          delay: 3000,
          icon: "fa fa-check-circle",
          message: "Catégorie supprimée avec succès !",
        });
        toggleShow();
      } else {
        console.error("Erreur lors de la suppression de la catégorie");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      if (error instanceof AxiosError) {
        console.error(error.response);
        if (
          error?.response?.data.code === "TOKEN_EXPIRED" &&
          error.status === 401
        )
          _expiredSession(
            (success: boolean, message: string, delay: number) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
      }
    } finally {
      setFeedBackState({
        isLoading: false,
        loadingMessage: "",
        isError: false,
        errorMessage: "",
      });
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = selectedCategory.id;
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "chargement...",
    }));

    try {
      const response = await categoriesServiceInstance.duplicateCategory(
        id,
        newName,
      );

      if (response.status === 201) {
        getPaginatedCategories(
           debouncedFilters.page,
          debouncedFilters.perPage,
          debouncedFilters.id,
          debouncedFilters.name,
          debouncedFilters.store,
          setIsLoading,
          setPaginatedCategories,
        );
        handleCloseDuplicate();
        setToastData({
          bg: "success",
          position: "top-end",
          delay: 4000,
          icon: "fa fa-check-circle",
          message: response.data.message
            ? response.data.message
            : "Catégorie dupliquée avec succès",
        });
        setNewName("");
        setId("");
        toggleShow();
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.code === "TOKEN_EXPIRED"
        ) {
          _expiredSession(
            (success, message, delay) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
        } else {
          setToastData({
            bg: "danger",
            position: "top-end",
            delay: 7000,
            icon: "fa fa-xmark-circle",
            message: error?.response?.data?.message
              ? error?.response?.data?.message
              : error?.message === "Network Error"
                ? "Une erreur serveur est survenue, vérifier votre connexion internet. Si le problème persiste contactez votre administrateur"
                : "Une erreur est survenue lors de la duplication",
          });
          toggleShow();
        }
      }
    } finally {
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "",
      }));
    }
  };

  const shopDisplay = (
    shopData: ShopType[],
    shop: number,
    indx: number,
    category: CategoriesType,
  ) => {
    const shopName =
      shopData && shopData.find((shops) => shops.id === shop)?.name;
    const shopConna = indx < category.shopIds.length - 1 ? ", " : "";

    return shopName && shopName + shopConna;
  };

  return {
    //States
    userData,
    userRole,
    columnsData,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    file,
    setFile,
    imgRglt,
    setImgRglt,
    paginatedCategories,
    setPaginatedCategories,
    showAddEditModal,
    setShowAddEditModal,
    showDuplicate,
    setShowDuplicate,
    showDeleteModal,
    setShowDeleteModal,
    isFiltering,
    totalPages,
    currentPage: parseInt(page),
    shops,
    feedBackState,
    selectedCategoryId,
    trigger,
    newName,
    setNewName,

    //Filters
    page,
    setPage,
    perPage,
    setPerPage,
    id,
    setId,
    name,
    setName,
    store,
    setStore,

    //Handlers
    handleShowEditModal,
    handleShowDuplicate,
    handleCloseDuplicate,
    handleCloseAddEditModal,
    handleShowDeleteModal,
    handleCloseDeleteModal,
    handleDuplicate,
    handleUpdateCategory,
    handleDeleteCategory,
    shopDisplay,
  };
}
