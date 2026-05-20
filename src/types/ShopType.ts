import { UserDataType } from "@/stores/userDataStore";
import { FeedBackSatateType, ToastDataType } from "./DiversType";

export type ShopType = {
  id: number;
  name: string;
  cover: string;
};

export interface ShopHookType {
  columnsData: string[];
  shops: ShopType[];
  selectedShopId: number | null;
  isLoading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  showAddEditModal: boolean;
  showDeleteModal: boolean;
  userLogOut: () => void;
  trigger: string | undefined;
  feedBackState: {
    isLoading: boolean;
    loadingMessage: string;
    isError: boolean;
    errorMessage: string;
  };
  formData: {
    name: string;
    image: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      image: string;
    }>
  >;
  handleShowAddModal: () => void;
  handleCloseAddModal: () => void;
  handleShowDeleteModal: (id: number) => void;
  handleCloseDeleteModal: () => void;
  handleDeleteShop: (id: number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ShopSelectorHookType {
  userStoreData: UserDataType;
  userRole: "super_admin" | "user" | "admin";
  userLogOut: () => void;
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  feedBackState: FeedBackSatateType;
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>;
  shops: ShopType[];
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  formData: {
    name: string;
    image: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      image: string;
    }>
  >;
  showAdd: boolean;
  handleCloseAdd: () => void;
  handleShowAdd: () => void;
  onHandleShop: (id: number) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
