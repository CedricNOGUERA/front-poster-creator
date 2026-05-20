import { FeedBackSatateType } from "@/types/DiversType";
import { _sanitizeString } from "../functions";

export const validateForm = (
  form: HTMLFormElement,
  e: React.FormEvent<HTMLFormElement>,
  formData: {
      name: string,
      image: string,
    },
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>,
) => {
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  if (formData.name.trim() === "") {
    setFeedBackState((prev) => ({
      ...prev,
      isError: true,
      errorMessage: "Veuillez saisir un nom de magasin",
      isLoading: false,
      loadingMessage: "",
    }));

    return false;
  }

  return true;
};


export const createShopFormData = (file:  File | null, formData: { name: string, image: string }) => {
  const shopThumbnailName = file
    ? _sanitizeString(file.name)
    : "";

  const shopFormData = new FormData();

  shopFormData.append(
    "data",
    JSON.stringify({
      name: formData.name,
      cover:
        file &&
        `uploads/shopMiniatures/${formData.name}/${shopThumbnailName}`,
    })
  );

  if (file) {
    shopFormData.append("image", file);
  }

  return {
    shopFormData,
    shopThumbnailName,
  };
};
