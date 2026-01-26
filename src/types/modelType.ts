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