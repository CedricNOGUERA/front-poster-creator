export type HeaderComponentType = {
  type: string
  top: number
  left: number
  width: number
  height: number
  src?: string
  srcRglt?: string
  backgroundColor: string
  padding?: string
  showCustomValue?: boolean;
}
export type BackgroundComponentType = {
  type: string
  top: number
  left: number
  width: number
  height: number
  backgroundColor: string
  showCustomValue?: boolean;
}

export type ImageComponentType = {
  type: string
  top: number
  left: number
  src?: string
  width?: number
  height?: string | number
  showCustomValue?: boolean;
}

export type TextComponentType = {
  type: string
  top: number
  right?: number;
  left: number
  bottom?: number;
  text: string
  fontFamily: string
  rotation: number
  fontSize: number
  fontWeight: number
  color: string
  textDecoration?: 'none' | 'line-through'
  showCustomValue?: boolean;
}
export type NumberComponentType = {
  type: string
  right: number
  left?: number;
  top?: number;
  bottom?: number;
  text: string
  fontFamily: string
  rotation: number
  fontSize: number
  fontWeight: number
  color: string
  textDecoration?: 'none' | 'line-through'
  showCustomValue?: boolean;
}
export type PrincipalPriceComponentType = {
  type: string
  right: number
  left?: number;
  bottom: number;
  top?: number;
  width: number
  text: string
  fontFamily: string
  rotation: number
  fontSize: number
  fontWeight: number
  color: string
  textDecoration?: 'none' | 'line-through'
  showCustomValue?: boolean;
}

export type ComponentTypeMulti =
  | HeaderComponentType
  | NumberComponentType
  | TextComponentType
  | BackgroundComponentType
  | ImageComponentType
