import { FormCategoryDataType } from "@/types/CategoriesType";
import { AxiosError } from "axios";
import { _expiredSession, _showToast } from "../notifications";
import { ToastDataType } from "@/types/DiversType";
import { NavigateFunction } from "react-router";


export const errorFeedback = (message: string, setFeedBackState: React.Dispatch<React.SetStateAction<{
    isLoading: boolean;
    loadingMessage: string;
    isError: boolean;
    errorMessage: string;
}>>) => {
  setFeedBackState((prev) => ({
    ...prev,
    isError: true,
    errorMessage: message,
    isLoading: false,
    loadingMessage: "",
  }));
};

export const validateForm = (
  form: HTMLFormElement,
  setValidated: React.Dispatch<React.SetStateAction<boolean>>,
  errorFeedback: (message: string, setFeedBackState: React.Dispatch<React.SetStateAction<{
    isLoading: boolean;
    loadingMessage: string;
    isError: boolean;
    errorMessage: string;
}>>) => void,
  formData: FormCategoryDataType,
  setFeedBackState: React.Dispatch<React.SetStateAction<{
     isLoading: boolean;
    loadingMessage: string;
    isError: boolean;
    errorMessage: string;
}>>) => {
  if (!form.checkValidity()) {
    form.reportValidity();
    setValidated(true);
    return false;
  }

  if (!formData.name.trim()) {
    errorFeedback("Veuillez saisir un nom de catégorie", setFeedBackState);
    return false;
  }

  if (formData.name.trim().length < 2) {
    errorFeedback(
      "Le nom de la catégorie doit contenir au moins 2 caractères",
      setFeedBackState
    );
    return false;
  }

  if (formData.shopIds.length === 0) {
    errorFeedback("Veuillez sélectionner au moins un magasin", setFeedBackState);
    return false;
  }

  return true;
};

export const generateImagePath = (
  nextId: number,
  file?: File | null
) => {
  return file?.name
    ? `/uploads/categories/headerPictures/${nextId}/${file.name}`
    : null;
};

export const buildCategory = (
  nextId: number,
  imageName: string | null,
  imageRgltName: string | null,
  formData: FormCategoryDataType,
) => {
  return {
    id: nextId,
    name: formData.name,
    icon: formData.icon,
    image: imageName,
    imageRglt: imageRgltName,
    shopIds: formData.shopIds,
    canvasId: nextId,

    canvas: [
      {
        type: "header",
        top: 0,
        left: 0,
        width: 500,
        height: 125,
        src: imageName,
        srcRglt: imageRgltName,
        backgroundColor:
          formData.backgroundColorHeader,
      },

      {
        type: "background-color",
        top: 125,
        left: 0,
        width: 500,
        height: 375,
        backgroundColor:
          formData.backgroundColorBody,
      },
    ],
  };
};

export const createCategoryFormData = (
  category: object,
  file: File | null,
  imgRglt: File | null
) => {
  const data = new FormData();

  data.append(
    "data",
    JSON.stringify(category)
  );

  if (file) {
    data.append("image", file);
  }

  if (imgRglt) {
    data.append("imageRglt", imgRglt);
  }

  return data;
};

export const resetCategoryForm = (setFormData: React.Dispatch<React.SetStateAction<FormCategoryDataType>>, setValidated: React.Dispatch<React.SetStateAction<boolean>>) => {
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

  setValidated(false);
};

export const handleAxiosError = (
  error: unknown,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
    toggleShow: () => void,
    userLogOut: () => void,
    navigate: NavigateFunction,
    setFeedBackState: React.Dispatch<React.SetStateAction<{
      isLoading: boolean;
      loadingMessage: string;
      isError: boolean;
      errorMessage: string;
    }>>
) => {
     if (error instanceof AxiosError) {
  if (
    error.status === 401 &&
    error.response?.data.error ===
      "Token expiré"
  ) {
    _expiredSession(
      (success, message, delay) =>
        _showToast(
          success,
          message,
          setToastData,
          toggleShow,
          delay
        ),
      userLogOut,
      navigate
    );

    return;
  }

  setFeedBackState((prev) => ({
    ...prev,
    error: true,
    errorMessage:
      "Une erreur s'est produite lors de l'ajout de la catégorie",
  }));

  setToastData({
    bg: "danger",
    position: "top-end",
    delay: 4000,
    icon: "fa fa-times-circle",
    message:
      "Une erreur s'est produite lors de l'ajout de la catégorie",
  });

  toggleShow();
}
};