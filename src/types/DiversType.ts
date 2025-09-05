import { ToastPosition } from "react-bootstrap/esm/ToastContainer"

export type NewTemplateType = {
  idShop: number | undefined
  idCategory: number | undefined
  nameCategory: string
  nameTemplate: string
  width: number | undefined
  height: number | undefined
  orientation: string | null
}

export type ToastDataType = {
  bg: string,
  position: ToastPosition | undefined,
  delay: number,
  icon: string,
  message: string,
}

export type FeedBackSatateType = {
  isLoading: boolean
  loadingMessage: string
  isError: boolean
  errorMessage: string
}

export type PictureType = {
  "id": number
  "name": string
  "src": string
  "value": string
  "createAt": string
}