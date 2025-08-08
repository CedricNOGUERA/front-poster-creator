import { ComponentTypeMulti } from "./ComponentType"

export type ModelType = {
    id: number,
    templateId: number,
    categoryId: number,
    dimensionId: number,
    canvas: ComponentTypeMulti[]
}