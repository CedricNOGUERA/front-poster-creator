import { ComponentTypeMulti } from "./ComponentType";
import { DimensionType } from "./DimensionType";
import { TemplateType } from "./TemplatesType";

export type ModelType = {
  id: number;
  templateId: number;
  categoryId: number;
  dimensionId: number;
  activated?: boolean;
  canvas: ComponentTypeMulti[];
};

export type ImagemodelType = {
  id: number;
  name: string;
  modelId: number;
  categoryId: number;
  dimensionId: number;
};

export type ModelResultType = {
    "total": number,
    "page": number,
    "perPage": number,
    "offset": number,
    "preview": boolean,
    "next": boolean,
    "models": ModelType[]
}


export type DebouncedFilterModelType = {
    page: string;
    perPage: string;
    id: string;
    template: string;
    dimension: string;
    status: string;
}

export type ModelHookType = {

    paginatedModels: ModelResultType;
    selectedModel: ModelType;
    templates: TemplateType[];
    imageModels: ImagemodelType[];
    isFiltering: boolean;
    totalPages: number;
    currentPage: number;
    showDeleteModal: boolean;
    isLoading: boolean;
    isLoadingDisplay: boolean;
    dimensions: DimensionType[];
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    perPage: string;
    setPerPage: React.Dispatch<React.SetStateAction<string>>;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    template: string;
    setTemplate: React.Dispatch<React.SetStateAction<string>>;
    dimension: string;
    setDimension: React.Dispatch<React.SetStateAction<string>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    //handlers
    handleCloseDeleteModal: () => void;
    handleShowDeleteModal: (model: ModelType) => void;
    handleDeleteModel: (id: number) => Promise<void>;
    handleCloseActivatedModal: () => void;
    handleShowActivatedModal: (model: ModelType) => void;
}