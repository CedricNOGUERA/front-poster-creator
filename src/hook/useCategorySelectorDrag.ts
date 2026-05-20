import categoriesServiceInstance from "@/services/CategoriesServices";
import useStoreApp from "@/stores/storeApp";
import userDataStore from "@/stores/userDataStore";
import { CategoriesType, FormCategoryDataType } from "@/types/CategoriesType";
import { ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import { _getCategories } from "@/utils/apiFunctions";
import {
  buildCategory,
  createCategoryFormData,
  errorFeedback,
  generateImagePath,
  handleAxiosError,
  resetCategoryForm,
  validateForm,
} from "@/utils/form/addCategoryFunction";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

interface ContextCategorySelectorDragType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  shops: ShopType[];
}

export default function () {
  /* States
   *******************************************************************************************/
  const { toggleShow, setToastData } =
    useOutletContext<ContextCategorySelectorDragType>();
  const storeApp = useStoreApp();
  const userLogOut = userDataStore((state) => state.authLogout);
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<CategoriesType[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [imgRglt, setImgRglt] = React.useState<File | null>(null);
  const [feedBackState, setFeedBackState] = React.useState({
    isLoading: false,
    loadingMessage: "",
    isError: false,
    errorMessage: "",
  });
  const [validated, setValidated] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    [key: string]: string;
  }>({});
  const [formData, setFormData] = React.useState<FormCategoryDataType>({
    name: "",
    icon: { name: "", value: "" },
    image: "",
    imageRglt: "",
    backgroundColorHeader: "#ff0000",
    backgroundColorBody: "#ffea00",
    shopIds: [],
    canvas: [],
  });
  const [showAdd, setShowAdd] = React.useState(false);
  const handleCloseAdd = () => {
    resetForm();
    setShowAdd(false);
  };
  const handleShowAdd = () => setShowAdd(true);

  /* useEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
  }, [setToastData, toggleShow]);

  /* functions
   *******************************************************************************************/

  // Fonction de validation en temps réel
  const validateField = (fieldName: string, value: string) => {
    const errors = { ...fieldErrors };
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errors.name = "Le nom est requis";
        } else if (value.trim().length < 2) {
          errors.name = "Le nom doit contenir au moins 2 caractères";
        } else {
          delete errors.name;
        }
        break;
      case "icon":
        if (!value.trim()) {
          errors.icon = "L'icône est requise";
        } else if (!value.trim().startsWith("fa fa-")) {
          errors.icon = 'L\'icône doit commencer par "fa fa-"';
        } else {
          delete errors.icon;
        }
        break;
      case "backgroundColorHeader":
      case "backgroundColorBody":
        if (!hexColorRegex.test(value)) {
          errors[fieldName] = "Veuillez sélectionner une couleur valide";
        } else {
          delete errors[fieldName];
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
  };

  const onHandleCategory = (id: number) => {
    const idCanvas =
      categories &&
      categories?.find((category: CategoriesType) => category.id === id)
        ?.canvasId;
    if (idCanvas) {
      storeApp.setCanvasId(idCanvas);
    }
    storeApp.setDimensionId(9);
    storeApp.setCategoryId(id);
    storeApp.nextStep();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (
      !validateForm(
        form,
        setValidated,
        errorFeedback,
        formData,
        setFeedBackState,
      )
    ) {
      return;
    }

    setValidated(true);
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement...",
      isError: false,
      errorMessage: "",
    }));

    const lastId = categories.reduce(
      (maxId, item) => Math.max(maxId, item.id || 0),
      0,
    );
    const nextId = lastId + 1;

    const imageName = generateImagePath(nextId, file);

    const imageRgltName = generateImagePath(nextId, imgRglt);

    const newCategory = buildCategory(
      nextId,
      imageName,
      imageRgltName,
      formData,
    );

    try {
      const categoryFormData = createCategoryFormData(
        newCategory,
        file,
        imgRglt,
      );

      await categoriesServiceInstance.postCategory(categoryFormData);

      setCategories((prev: CategoriesType[]) => [
        ...prev,
        newCategory as unknown as CategoriesType,
      ]);
      resetCategoryForm(setFormData, setValidated);

      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Catégorie ajoutée avec succès",
      });
      toggleShow();
      handleCloseAdd();
    } catch (error: unknown) {
      console.error(error);

      handleAxiosError(
        error,
        setToastData,
        toggleShow,
        userLogOut,
        navigate,
        setFeedBackState,
      );
    } finally {
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      icon: { name: "", value: "" },
      image: "",
      imageRglt: "",
      backgroundColorHeader: "#ff0000",
      backgroundColorBody: "#ffea00",
      shopIds: [],
      canvas: [],
    });
    setFile(null);
    setImgRglt(null);
    setValidated(false);
    setFieldErrors({});
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: false,
      loadingMessage: "",
      isError: false,
      errorMessage: "",
    }));
  };

  return {
    //States
    categories,
    storeApp,
    formData,
    setFormData,
    file,
    setFile,
    setImgRglt,
    feedBackState,
    showAdd,
    validated,
    fieldErrors,
    //Handlers
    validateField,
    handleCloseAdd,
    handleSubmit,
    onHandleCategory,
    handleShowAdd,
  };
}
