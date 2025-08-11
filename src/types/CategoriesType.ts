import { ComponentTypeMulti } from "./ComponentType"

export type CategoriesType = {
  id?: number
  name: string
  image: string
  imageRglt: string | null
  icon: {"name": string, "value": string}
  shopIds: number[]
  canvasId: number
  canvas: ComponentTypeMulti[]
}