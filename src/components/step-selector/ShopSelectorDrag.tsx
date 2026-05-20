import { ModalAddShop } from "../ui/Modals";
import useShopSelectorDrag from "@/hook/useShopSelectorDrag";
import ShopCard from "../DragDropComponents/shop/ShopCard";
import AddElementCard from "../ui/AddElementCard";

type Props = {
  title: string;
};

export const ShopSelectorDrag = ({ title }: Props) => {

  const useShopSelector = useShopSelectorDrag();

  const modalAddShopProps = {
    showAdd: useShopSelector.showAdd,
    handleCloseAdd: useShopSelector.handleCloseAdd,
    handleSubmit: useShopSelector.handleSubmit,
    formData: useShopSelector.formData,
    setFormData: useShopSelector.setFormData,
    setFile: useShopSelector.setFile,
    feedBackState: useShopSelector.feedBackState,
  };

  /* Render
   *******************************************************************************************/
  return (
    <div>
      <h2 className="fs-4 fw-bold text-primary">{title}</h2>
      <div className="d-flex flex-wrap justify-content-center align-items-center mt-5 mb-5">
        <ShopCard useShopSelector={useShopSelector} />
        {/* <AddShopButton useShopSelector={useShopSelector} /> */}
        <AddElementCard role={useShopSelector.userStoreData.role} handleShowAdd={useShopSelector.handleShowAdd} label="Magasin" />
      </div>
      <ModalAddShop modalAddShopProps={modalAddShopProps} />
    </div>
  );
};
