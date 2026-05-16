import React from "react";
import {
  Button,
  Container,
} from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import {
  useOutletContext,
} from "react-router-dom";
import { ShopType } from "@/types/ShopType";
import {
  _handleShowAddModal,

} from "@/utils/modalFunction";
import { ToastDataType } from "@/types/DiversType";
import {
  ModalAddStore,
  ModalDeleteStore,
  ModalUpdateStore,
} from "@/components/ui/Modals";
import TablePagination from "@/components/ui/table/TablePagination";
import { useStorePage } from "@/hook/useStorePage";
import StoreTable from "@/components/dashBoardComponents/tables/StoreTable";

interface ContextStoreType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export default function StorePage() {
  const useStore = useStorePage();
  const { shops } =
    useOutletContext<ContextStoreType>();

  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Magasin</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="primary"
            className="rounded d-flex align-items-center gap-1"
            onClick={() => _handleShowAddModal(useStore.setShowAddModal)}
          >
            <FaPlusCircle /> <span>un magasin</span>
          </Button>
        </div>
        <StoreTable useStore={useStore} shops={shops} />
        <TablePagination
          tablePaginationProps={{
            currentPage: useStore.currentPage,
            totalPages: useStore.totalPages,
            page: useStore.page,
            setPage: useStore.setPage,
            perPage: useStore.perPage,
            setPerPage: useStore.setPerPage,
          }}
        />
        <ModalAddStore
          modalAddStoreProps={{
            showAddModal: useStore.showAddModal,
            setSelectedStore: useStore.setSelectedStore,
            setShowAddModal: useStore.setShowAddModal,
            addStore: useStore.addStore,
            selectedStore: useStore.selectedStore,
            shops,
            isLoading: useStore.isLoading,
          }}
        />
        <ModalUpdateStore
          modalUpdateStoreProps={{
            showEditModal: useStore.showEditModal,
            setSelectedStore: useStore.setSelectedStore,
            setShowEditModal: useStore.setShowEditModal,
            updateStore: useStore.updateStore,
            selectedStore: useStore.selectedStore,
            shops,
            isLoading: useStore.isLoading,
          }}
        />
        <ModalDeleteStore
          modalDeleteStoreProps={{
            showDeleteModal: useStore.showDeleteModal,
            selectedStore: useStore.selectedStore,
            setSelectedStore: useStore.setSelectedStore,
            setShowDeleteModal: useStore.setShowDeleteModal,
            deleteStore: useStore.deleteStore,
            isLoading: useStore.isLoading,
          }}
        />
      </Container>
    </Container>
  );
}
