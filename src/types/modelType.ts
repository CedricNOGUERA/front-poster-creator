import { ComponentTypeMulti } from "./ComponentType";

export type ModelType = {
  id: number;
  templateId: number;
  categoryId: number;
  dimensionId: number;
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