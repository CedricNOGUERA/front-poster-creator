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

export type CategoriesPaginatedType = {
  categories: CategoriesType[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number
    previousPage: number
  }
}