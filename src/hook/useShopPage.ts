import React from "react";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { ShopType } from "@/types/ShopType";
import shopServiceInstance from "@/services/ShopsServices";
import { getAllShops } from "@/utils/admin/shopFunction";
import { ToastDataType } from "@/types/DiversType";
import { AxiosError } from "axios";
import { _expiredSession, _showToast } from "@/utils/notifications";
interface ContextCategorySelectorDragType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export function useShopPage() {
  const navigate = useNavigate();
  const { setToastData, toggleShow } = useOutletContext<ContextCategorySelectorDragType>();
  const columnsData = ["ID", "logo", "Nom", "Actions"];
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout);
  const [shops, setShops] = React.useState<ShopType[]>([]);
  const [selectedShopId, setSelectedShopId] = React.useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showAddEditModal, setShowAddEditModal] =
    React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const path = window.location.pathname;
  const trigger = path.split("/").filter(Boolean).pop();

  const [feedBackState, setFeedBackState] = React.useState({
    isLoading: false,
    loadingMessage: "",
    isError: false,
    errorMessage: "",
  });
  const [formData, setFormData] = React.useState<{
    name: string;
    image: string;
  }>({
    name: "",
    image: "",
  });

  React.useEffect(() => {
    getAllShops(setShops, setIsLoading);
  }, []);

  const handleShowAddModal = () => {
    setShowAddEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddEditModal(false);
    //reset les données du formulaire d'ajout
    setFormData({
    name: "",
    image: "",
  })
  };

  const handleShowDeleteModal = (id: number) => {
    setSelectedShopId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedShopId(null);
  };

  const handleDeleteShop = async (id: number) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const deleteResponse = await shopServiceInstance.deleteShop(id);
      if (deleteResponse.status === 200) {
        handleCloseDeleteModal();
        getAllShops(setShops, setIsLoading);
        _showToast(
          true,
          deleteResponse?.data.message,
          setToastData,
          toggleShow,
          4000,
        );
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du magasin:", err);
      if (err instanceof AxiosError) {
        if (err.status === 403) {
          _expiredSession(
            (success, message, delay) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shopFormData = new FormData();
    shopFormData.append(
      "data",
      JSON.stringify({
        name: formData?.name,
        cover: file && `uploads/shopMiniatures/${formData?.name}/${file?.name}`,
      }),
    );
    if (file) {
      shopFormData.append("image", file);
    }
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement",
    }));

    try {
      const response = await shopServiceInstance.addShop(shopFormData);
      if (response.ok) {
        const newShop = {
          id: 56,
          name: formData?.name,
          cover: file
            ? `uploads/shopMiniatures/${formData?.name}/${file?.name}`
            : "",
        };

        setShops((prev) => [...prev, newShop]);
        
        setToastData({
          bg: "success",
          position: "top-end",
          delay: 3000,
          icon: "fa fa-check-circle",
          message: "Nouveau magasin ajouté avec succès",
        });
        toggleShow();
        getAllShops(setShops, setIsLoading);
        handleCloseAddModal();
      }
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-x-mark",
        message: "Une erreur s'est produite lors de l'ajout",
      });
      toggleShow();
    } finally {
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "",
      }));
    }
  };

  return {
    //States
    columnsData,
    shops,
    selectedShopId,
    isLoading,
    setFile,
    showAddEditModal,
    showDeleteModal,
    userLogOut,
    trigger,
    feedBackState,
    formData,
    setFormData,
    //Handlers
    handleShowAddModal,
    handleCloseAddModal,
    handleShowDeleteModal,
    handleCloseDeleteModal,
    handleDeleteShop,
    handleSubmit,
  };
}
