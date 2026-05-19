import {
  ModalAddEditCategory,
  ModalDuplicateCategory,
  ModalGenericDelete,
} from "@/components/ui/Modals";
import { Container } from "react-bootstrap";
import TablePagination from "@/components/ui/table/TablePagination";
import useCategoriesPage from "@/hook/useCategoriesPage";
import CategoryTable from "@/components/dashBoardComponents/tables/CategoryTable";

export default function CategoriesPage() {
  const useCategories = useCategoriesPage();

  const modalAddEditCategoryProps = {
    showAdd: useCategories.showAddEditModal,
    handleCloseAdd: useCategories.handleCloseAddEditModal,
    handleSubmit: useCategories.handleUpdateCategory,
    formData: useCategories.selectedCategory,
    setFormData: useCategories.setSelectedCategory,
    setFile: useCategories.setFile,
    setImgRglt: useCategories.setImgRglt,
    feedBackState: useCategories.feedBackState,
    shopData: useCategories.shops,
  };
  const modalDuplicateCategoryProps = {
    showDuplicate: useCategories.showDuplicate,
    handleCloseDuplicate: useCategories.handleCloseDuplicate,
    selectedCategory: useCategories.selectedCategory,
    setSelectedCategory: useCategories.setSelectedCategory,
    newName: useCategories.newName,
    setNewName: useCategories.setNewName,
    handleSubmit: useCategories.handleDuplicate,
  };
  const modalDeleteCategoryProps = {
    show: useCategories.showDeleteModal,
    handleClose: useCategories.handleCloseDeleteModal,
    selectedId: useCategories.selectedCategoryId,
    handleDelete: useCategories.handleDeleteCategory,
    title: "la catégorie",
    isLoading: useCategories.isLoading,
  };

  return (
    <Container fluid className="p-0">
      <h3 className="py-3 mb-0">Gestion des Catégories</h3>
      <Container>
        <CategoryTable useCategories={useCategories} />
        <TablePagination
          tablePaginationProps={{
            currentPage: useCategories.currentPage,
            totalPages: useCategories.totalPages,
            page: useCategories.page,
            setPage: useCategories.setPage,
            perPage: useCategories.perPage,
            setPerPage: useCategories.setPerPage,
          }}
        />
      </Container>
      <ModalAddEditCategory
        modalAddEditCategoryProps={modalAddEditCategoryProps}
      />
      <ModalDuplicateCategory
        modalDuplicateCategoryProps={modalDuplicateCategoryProps}
      />
      <ModalGenericDelete modalGenericDeleteProps={modalDeleteCategoryProps} />
    </Container>
  );
}
