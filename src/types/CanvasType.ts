import { ComponentTypeMulti } from "./ComponentType"

export type Canvastype = {
  id: number
  name: string
  canvas: ComponentTypeMulti[]
}
export type Modeltype = {
  id?: number
  templateId?: number
  categoryId: number
  dimensionId: number
  canvas: ComponentTypeMulti[]
}