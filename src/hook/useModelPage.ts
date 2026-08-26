/* eslint-disable react-hooks/exhaustive-deps */
import modelsServiceInstance from "@/services/modelsServices";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { DimensionType } from "@/types/DimensionType";
import { ToastDataType } from "@/types/DiversType";
import {
  DebouncedFilterModelType,
  ImagemodelType,
  ModelResultType,
  ModelType,
} from "@/types/modelType";
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import {
  getFilteredModelData,
  getPaginatedModels,
} from "@/utils/admin/modelFunction";
import { _getAllImagesModels, _getDimensions, _getTemplates } from "@/utils/apiFunctions";
import { _expiredSession, _showToast } from "@/utils/notifications";
import { AxiosError } from "axios";
import React from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
interface ContextType {
  shops: ShopType[];
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  toggleShow: () => void;
}

export function useModelPage() {
  const [params] = useSearchParams();
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout);
  const navigate = useNavigate();
  const { setToastData, toggleShow } = useOutletContext<ContextType>();
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [dimensions, setDimensions] = React.useState<DimensionType[]>([]);
  const [paginatedModels, setPaginatedModels] = React.useState<ModelResultType>(
    {} as ModelResultType,
  );
  const [imageModels, setImageModels] = React.useState<ImagemodelType[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<ModelType>(
    {} as ModelType,
  );
  const [showActivatedModal, setShowActivatedModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingDisplay, setIsLoadingDisplay] =
    React.useState<boolean>(false);

  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "10",
  );
  const [id, setId] = React.useState<string>(params.get("id") || "");
  const [template, setTemplate] = React.useState<string>(
    params.get("template") || "",
  );
  const [dimension, setDimension] = React.useState<string>(
    params.get("dimension") || "",
  );
  const [status, setStatus] = React.useState<string>(
    params.get("status") || "",
  );
  const filters = { page, perPage, id, template, dimension, status };

  const isFiltering = [id, template, dimension, status].every((v) => v === "");

  const totalPages = Math.ceil(paginatedModels?.total / parseInt(perPage));
  const currentPage = parseInt(page);

  // Chargement initial des données
  React.useEffect(() => {
    _getTemplates(setTemplates);
    _getAllImagesModels(setImageModels);
    _getDimensions(setDimensions)
  }, []);

  // Debounce
  const [debouncedFilters, setDebouncedFilters] =
    React.useState<DebouncedFilterModelType>(filters);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, id, template, dimension, status]);

  // Fetch
  React.useEffect(() => {
    const params = new URLSearchParams();
    getFilteredModelData(
      params,
      debouncedFilters,
      navigate,
      setIsLoading,
      setPaginatedModels,
    );
  }, [debouncedFilters, navigate]);

  const handleShowActivatedModal = (model: ModelType) => {
    setSelectedModel(model);
    setShowActivatedModal(true);
  };

  const handleCloseActivatedModal = () => {
    setSelectedModel({} as ModelType);
    setShowActivatedModal(false);
  };
  const handleShowDeleteModal = (model: ModelType) => {
    setSelectedModel(model);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedModel({} as ModelType);
    setShowDeleteModal(false);
  };

  const handleDeleteModel = async (SelectedModelid: number) => {
    if (!selectedModel) return;
    setIsLoading(true);
    try {
      await modelsServiceInstance.deleteModel(SelectedModelid);
      handleCloseDeleteModal();

      // Recharger les données originales après suppression
      _getAllImagesModels(setImageModels);
      getPaginatedModels(
        page,
        perPage,
        id,
        template,
        dimension,
        status,
        setIsLoadingDisplay,
        setPaginatedModels,
      );
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("perPage", perPage);

      navigate(`/tableau-de-bord/modeles?${params.toString()}`);
      _showToast(true, "Suppression réussie", setToastData, toggleShow, 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression du modèle:", err);
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          _expiredSession(
            (success, message, delay) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
        }
      } else {
        _showToast(
          false,
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression du modèle",
          setToastData,
          toggleShow,
          3000,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatusModel = async (id: number, status: boolean | undefined, closeModal: ()=> void) => {
 const params = new URLSearchParams();
   
  try{
    const response = await modelsServiceInstance.patchStatusModel(id, !status)

    console.warn(response)
    closeModal()
     getFilteredModelData(
      params,
      debouncedFilters,
      navigate,
      setIsLoading,
      setPaginatedModels,
    );

  }catch(error){
    console.error(error)
  }
}
  

  return {
    //states
    paginatedModels,
    selectedModel,
    templates,
    imageModels,
    isFiltering,
    totalPages,
    currentPage,
    showDeleteModal,
    isLoading,
    isLoadingDisplay,
    dimensions,
    //Filtres
    page,
    setPage,
    perPage,
    setPerPage,
    id,
    setId,
    template,
    setTemplate,
    dimension,
    setDimension,
    status,
    setStatus,
    //handlers
    handleCloseDeleteModal,
    handleShowDeleteModal,
    handleDeleteModel,
    handleShowActivatedModal,
    handleCloseActivatedModal,
    showActivatedModal,
    setShowActivatedModal,
    changeStatusModel
  };
}
