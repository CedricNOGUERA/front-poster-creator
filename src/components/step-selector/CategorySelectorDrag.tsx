import React from "react";
import {  useOutletContext } from "react-router-dom";
import { ToastDataType } from "@/types/DiversType";
import { ModalAddCategory } from "../ui/Modals";
import { ComponentTypeMulti } from "@/types/ComponentType";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { ShopType } from "@/types/ShopType";
import AddElementCard from "../ui/AddElementCard";
import useCategorySelectorDrag from "@/hook/useCategorySelectorDrag";
import CategoryCard from "../DragDropComponents/caterory/CategoryCard";

type Props = {
  title: string;
};

export type FormCategoryDataType = {
  name: string;
  icon: { name: string; value: string };
  image: string;
  imageRglt: string;
  backgroundColorHeader: string;
  backgroundColorBody: string;
  shopIds: number[];
  canvas: ComponentTypeMulti[];
};

interface ContextCategorySelectorDragType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  shops: ShopType[];
}

export default function CategorySelectorDrag({ title }: Props) {

    /* hook data
   *******************************************************************************************/
  const useCategorySelector = useCategorySelectorDrag();

  /* States
   *******************************************************************************************/
  const { shops } =
  useOutletContext<ContextCategorySelectorDragType>();
  const userRole = userDataStore((state: UserDataType) => state.role);
  
  /* Props
   *******************************************************************************************/
  const modalAddCategoryProps = {
    showAdd: useCategorySelector.showAdd,
    handleCloseAdd: useCategorySelector.handleCloseAdd,
    handleSubmit: useCategorySelector.handleSubmit,
    formData: useCategorySelector.formData,
    setFormData: useCategorySelector.setFormData,
    setFile: useCategorySelector.setFile,
    setImgRglt: useCategorySelector.setImgRglt,
    feedBackState: useCategorySelector.feedBackState,
    validated: useCategorySelector.validated,
    file: useCategorySelector.file,
    fieldErrors: useCategorySelector.fieldErrors,
    validateField: useCategorySelector.validateField,
    shops: shops,
  };

  /* render
   *******************************************************************************************/
  return (
    <div>
      <h2 className="fs-4 fw-bold text-primary">{title}</h2>
      <div className="d-flex flex-wrap justify-content-center  align-items-center mt-5 mb-5">
        <CategoryCard useCategorySelector={useCategorySelector} shopId={useCategorySelector.storeApp.shopId as number} />
        <AddElementCard
          role={userRole}
          handleShowAdd={useCategorySelector.handleShowAdd}
          label={`Catégorie`}
        />
        <ModalAddCategory modalAddCategoryProps={modalAddCategoryProps} />
      </div>
    </div>
  );
}
