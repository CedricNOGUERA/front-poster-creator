import { Container } from "react-bootstrap";
import { ModalAddShop, ModalGenericDelete } from "@/components/ui/Modals";
import AddButton from "@/components/ui/table/AddButton";
import { useShopPage } from "@/hook/useShopPage";
import ShopTable from "@/components/dashBoardComponents/tables/ShopTable";

export default function ShopPage() {
  const useShop = useShopPage();
 
  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Enseignes</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <AddButton
            handleShowAdd={useShop.handleShowAddModal}
            title="une enseigne"
          />
        </div>
        <ShopTable useShop={useShop} />
      </Container>
      <ModalAddShop
        modalAddShopProps={{
          showAdd: useShop.showAddEditModal,
          handleCloseAdd: useShop.handleCloseAddModal,
          handleSubmit: useShop.handleSubmit,
          formData: useShop.formData,
          setFormData: useShop.setFormData,
          setFile: useShop.setFile,
          feedBackState: useShop.feedBackState,
        }}
      />

      <ModalGenericDelete
        modalGenericDeleteProps={{
          show: useShop.showDeleteModal,
          handleClose: useShop.handleCloseDeleteModal,
          selectedId: useShop.selectedShopId,
          handleDelete: useShop.handleDeleteShop,
          title: "le magasin",
          isLoading: useShop.isLoading,
        }}
      />
    </Container>
  );
}
