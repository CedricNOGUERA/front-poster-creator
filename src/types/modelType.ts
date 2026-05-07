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
    "total": 230,
    "page": 1,
    "perPage": 10,
    "offset": 0,
    "preview": false,
    "next": false,
    "models": ModelType[]
}