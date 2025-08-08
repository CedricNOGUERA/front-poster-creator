import { ComponentTypeMulti } from "./ComponentType"

export type CategoriesType = {
  id?: number
  name: string
  image: string
  imageRglt: string | null
  icon: string
  shopIds: number[]
  canvasId: number
  canvas: ComponentTypeMulti[]
}