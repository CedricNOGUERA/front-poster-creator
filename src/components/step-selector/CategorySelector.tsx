/* eslint-disable react-hooks/exhaustive-deps */
import useStoreApp from "@/stores/storeApp";
import { CategoriesType } from "@/types/CategoriesType";
import { FeedBackSatateType, ToastDataType } from "@/types/DiversType";
import { _getCategories } from "@/utils/apiFunctions";
import React from "react";
import { useOutletContext } from "react-router-dom";
import DynamicIcon from "../ui/DynamicIcon";
type Props = {
  title: string;
};
interface ContextType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
}

export const CategorySelector = ({ title }: Props) => {
  /* States
   *******************************************************************************************/
  const {toggleShow, setToastData, setFeedBackState} = useOutletContext<ContextType>()
  const storeApp = useStoreApp();
  const [categories, setCategories] = React.useState<CategoriesType[]>([])


  React.useEffect(() => {
    _getCategories(setCategories, setToastData, toggleShow, setFeedBackState)
  }, [])

  /* Functions
   *******************************************************************************************/
  const onHandleCategory = (id: number) => {
    storeApp.setCategoryId(id);
    storeApp.nextStep();
  };

  /* Render Function - For Data Fetching
   *******************************************************************************************/
  return (
    <>
      <h2 className="fs-4 fw-bold text-primary">{title}</h2>
      <div className="d-flex flex-wrap justify-content-center  align-items-center mt-5 mb-5">
        {categories.map((category) => {
          if (category.shopIds.includes(storeApp.shopId)) {
            return (
              <div
                key={category.id}
                className="hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center"
                style={{ width: "200px", height: "183px" }}
                onClick={() => onHandleCategory(category.id as number)}
              >
                {category.icon.value !== "" && [
                  <DynamicIcon iconKey={category.icon.value} size={42} className="text-primary" />
                ]}
                <p className="mt-2 text-center fw-bold fs-5 text-primary">
                  {category.name}
                </p>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};
