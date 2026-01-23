import { FormCategoryDataType } from "@/components/step-selector/CategorySelectorDrag"
import { FeedBackSatateType, ToastDataType } from "./DiversType"
import { ShopType } from "./ShopType"
import { UserType } from "./UserType"
import { SideBarDataType } from "@/components/DragDropComponents/SideBar"
import { CategoriesType } from "./CategoriesType"
import { TemplateType } from "./TemplatesType"

//Delete categories picture
export interface ModalDeleteType {
    showDelete: boolean
    handleCloseDelete: () => void
    selectedIndex: number | null
    sideBarData: SideBarDataType[]
    setSideBarData: React.Dispatch<React.SetStateAction<SideBarDataType[]>>
    setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
    toggleShow: () => void
    categoryId: number
}

export interface ModalValidateModelType {
  showValidateModel: boolean
  handleCloseValidateModel: () => void
  addModel: (name: string) => Promise<void>
  imageName: string
  setImageName: React.Dispatch<React.SetStateAction<string>>
  template: TemplateType[] 
  setTemplate: React.Dispatch<React.SetStateAction<TemplateType[]>> 
  isErrorModel: boolean
  hasModel: boolean
}

export interface ModalUpdateModelType {
  showUpdateModel: boolean
  handleCloseUpdateModel: () => void
  updateModel: () => Promise<void>
}

export interface ModalEditModelType {
  showAddEditModal: boolean
  handleCloseAddEditModal: () => void
  selectedTemplate: TemplateType
  shopList: {label: string, value: number}[]
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateType>>
}

export interface ContextModalValidateModelType {
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  toggleShow: () => void
  feedBackState: FeedBackSatateType
  setFeedBackState:  React.Dispatch<React.SetStateAction<FeedBackSatateType>>
}

export interface ModalAddCategoryType {
  showAdd: boolean 
  handleCloseAdd: () => void 
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void 
  formData: FormCategoryDataType
  setFormData: React.Dispatch<React.SetStateAction<FormCategoryDataType>>
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  setImgRglt: React.Dispatch<React.SetStateAction<File | null>>
  feedBackState: FeedBackSatateType
  shops: ShopType[]
  // resetForm: () => void
  validated: boolean
  file: File | null
  fieldErrors: {[key: string]: string}
  validateField: (fieldName: string, value: string) => void
}
export interface ModalAddEditCategoryType {
  showAdd: boolean 
  handleCloseAdd: () => void 
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void 
  formData: CategoriesType
  setFormData: React.Dispatch<React.SetStateAction<CategoriesType>>
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  setImgRglt: React.Dispatch<React.SetStateAction<File | null>>
  feedBackState: FeedBackSatateType
  shopData: ShopType[]
}

export interface ModalDeleteUserType {
  showDelete: boolean
  handleCloseDelete: () => void
  selectedUser: UserType | null
  deleteUser: (id: number) => Promise<void>
  isLoading: boolean | undefined
}

export interface ModalGenericDeletePropsType {
  show: boolean;
  handleClose: () => void;
  selectedId: number | null | undefined;
  handleDelete: (id: number) => void | Promise<void>;
  title: string;
  isLoading: boolean;
}
export interface ModalAddShopType {
  showAdd: boolean;
  handleCloseAdd: () => void;
  formData: {
    name: string;
    image: string;
};
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    image: string;
  }>>
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  feedBackState: FeedBackSatateType

}


export interface ModalAddPictureType {
  showAdd: boolean 
  handleCloseAdd: () => void 
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void 
  imageName: string
  setImageName: React.Dispatch<React.SetStateAction<string>>
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  feedBackState: {
    isLoading: boolean
    loadingMessage: string
  }
  // validated: boolean
  // fieldErrors: {[key: string]: string}
  // validateField: (fieldName: string, value: string) => void
}

