import { ModalGenericDelete } from "@/components/ui/Modals";
import { ModalAddUser } from "@/components/users/ModalUser";
import { ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import React from "react";
import { Container } from "react-bootstrap";
import {
  useOutletContext,
} from "react-router-dom";
import { UserTable } from "../../components/dashBoardComponents/tables/Tables";
import AddButton from "@/components/ui/table/AddButton";
import TablePagination from "@/components/ui/table/TablePagination";
import { useUserManager } from "@/hook/useUserManager";

interface ContextShopSelectorType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  shops: ShopType[];
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>;
}

export default function UserManager() {
  /* States
   *******************************************************************************************/
  const { shops } = useOutletContext<ContextShopSelectorType>();
 
  const um = useUserManager();

  return (
      <Container fluid className="p-0">
      <h3 className="py-3">Gestion des utilisateurs</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <AddButton handleShowAdd={um.handleShowAdd} title="un utilisateur" />
        </div>
        <UserTable userTableProps={{ ...um, shops }} />
        <TablePagination tablePaginationProps={{
          currentPage: um.currentPage,
          totalPages: um.totalPages,
          page: um.page, setPage: um.setPage,
          perPage: um.perPage, setPerPage: um.setPerPage,
        }} />
      </Container>

      <ModalAddUser
        showAdd={um.showAdd}
        handleCloseAdd={um.handleCloseAdd}
        userDataToEdit={um.selectedUser}
      />
      <ModalGenericDelete modalGenericDeleteProps={{
        show: um.showDelete,
        handleClose: um.handleCloseDelete,
        selectedId: um.selectedUserId,
        handleDelete: um.deleteUser,
        title: "l'utilisateur",
        isLoading: um.isLoading,
      }} />
    </Container>
  );
}
