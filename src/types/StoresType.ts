
export interface StoresType {
  id: number;
  name: string;
  companyId: number;
}

export interface ResultStoreType {
  total: number;
  page: number;
  perPage: number;
  offset: number;
  preview: boolean;
  next: boolean;
  stores: StoresType[];
}


export interface DebouncedFilterStoreType {
  page: string;
  perPage: string;
  id: string;
  name: string;
  company: string;
}

export interface StoreHookType {
    paginatedStores: ResultStoreType;
    isLoadingDisplay: boolean;
    isFiltering: boolean;
    showAddModal: boolean;
    showDeleteModal: boolean;
    showEditModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStore: StoresType;
    setSelectedStore: React.Dispatch<React.SetStateAction<StoresType>>;
    isLoading: boolean;
    userRole: "user" | "super_admin" | "admin";
    totalPages: number;
    currentPage: number;
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    perPage: string;
    setPerPage: React.Dispatch<React.SetStateAction<string>>;
    id: string;
    name: string;
    company: string;
    setId: React.Dispatch<React.SetStateAction<string>>
    setName: React.Dispatch<React.SetStateAction<string>>
    setCompany: React.Dispatch<React.SetStateAction<string>>
    addStore: () => void
    updateStore: (id: number, data: Partial<StoresType>) => void
    deleteStore: (id: number) => Promise<void>;
}
