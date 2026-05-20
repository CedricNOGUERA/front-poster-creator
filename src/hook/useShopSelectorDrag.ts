import shopServiceInstance from "@/services/ShopsServices";
import useStoreApp from "@/stores/storeApp";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { FeedBackSatateType, ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import { _getAllShops } from "@/utils/apiFunctions";
import { createShopFormData, validateForm } from "@/utils/form/addShopFunction";
import { _sanitizeString } from "@/utils/functions";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

interface ContextShopSelectorDragType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  feedBackState: FeedBackSatateType;
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>;
  shops: ShopType[];
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>;
}

export default function useShopSelectorDrag() {
  /* States
   *******************************************************************************************/
  const navigate = useNavigate();
  const {
    toggleShow,
    setToastData,
    feedBackState,
    setFeedBackState,
    shops,
    setShops,
  } = useOutletContext<ContextShopSelectorDragType>();
  const userStoreData = userDataStore((state: UserDataType) => state);
  const userRole = userDataStore((state: UserDataType) => state.role);
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout);

  const storeApp = useStoreApp();
  const [file, setFile] = React.useState<File | null>(null);
  const [formData, setFormData] = React.useState<{
    name: string;
    image: string;
  }>({
    name: "",
    image: "",
  });

  const [showAdd, setShowAdd] = React.useState(false);
  const handleCloseAdd = () => {
    resetForm();
    setShowAdd(false);
  };
  const handleShowAdd = () => setShowAdd(true);

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    // Redirection si l'utilisateur a le rôle "user"
    if (userRole === "user") {
      navigate("/editeur-de-bon-plan");
      return;
    }
  }, [userRole, navigate]);

  /* Functions
   *******************************************************************************************/
  const onHandleShop = (id: number) => {
    storeApp.setShopId(id);
    storeApp.nextStep();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
    });
  };

  const handleSuccess = (shopThumbnailName: string) => {
    const newShop = {
      id: shops?.length + 1,
      name: formData.name,
      cover: file
        ? `uploads/shopMiniatures/${formData.name}/${shopThumbnailName}`
        : "",
    };

    setShops((prev) => [...prev, newShop]);
    _getAllShops(setShops, setToastData, userLogOut, navigate, toggleShow);
    setToastData({
      bg: "success",
      position: "top-end",
      delay: 3000,
      icon: "fa fa-check-circle",
      message: "Nouveau magasin ajouté avec succès",
    });
    toggleShow();
    handleCloseAdd();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    validateForm(form, e, formData, setFeedBackState);

    const { shopFormData, shopThumbnailName } = createShopFormData(
      file,
      formData,
    );

    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement",
    }));

    try {
      const response = await shopServiceInstance.addShop(shopFormData);
      if (response.ok) {
        handleSuccess(shopThumbnailName);
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
    userStoreData,
    userRole,
    userLogOut,
    toggleShow,
    setToastData,
    feedBackState,
    setFeedBackState,
    shops,
    setShops,
    file,
    setFile,
    formData,
    setFormData,
    showAdd,
    //Handlers
    handleCloseAdd,
    handleShowAdd,
    onHandleShop,
    resetForm,
    handleSubmit,
  };
}
