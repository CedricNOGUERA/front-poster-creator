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
    setFormData: React.Dispatch<React.SetStateAction<{
        name: string;
        image: string;
    }>>;
    handleShowAddModal: () => void;
    handleCloseAddModal: () => void;
    handleShowDeleteModal: (id: number) => void;
    handleCloseDeleteModal: () => void;
    handleDeleteShop: (id: number) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
