import { Col, Container, Row } from "react-bootstrap";
import TablePagination from "@/components/ui/table/TablePagination";
import { useModelPage } from "@/hook/useModelPage";
import ModelTable from "@/components/dashBoardComponents/tables/ModelTable";
import { ModalGenericDelete } from "@/components/ui/Modals";

export default function ModelsPage() {
  const useModel = useModelPage();

  return (
    <Container fluid className="relative p-0">
      <Row className="bg-light sticky-top d-flex justify-content-between align-items-center w-100 gx-0 ">
        <Col xs={2} sm={1} className="pt-2"></Col>
        <Col xs={8} sm={10}>
          <h3 className="pt-3 pb-2 mb-0">Gestion des Modèles</h3>
        </Col>
        <Col xs={2} sm={1}></Col>
      </Row>
      <Container>
        <ModelTable useModel={useModel} />
        <TablePagination
          tablePaginationProps={{
            currentPage: useModel.currentPage,
            totalPages: useModel.totalPages,
            page: useModel.page,
            setPage: useModel.setPage,
            perPage: useModel.perPage,
            setPerPage: useModel.setPerPage,
          }}
        />
      </Container>
      <ModalGenericDelete
        modalGenericDeleteProps={{
          show: useModel.showDeleteModal,
          handleClose: useModel.handleCloseDeleteModal,
          selectedId: useModel.selectedModel.id,
          handleDelete: useModel.handleDeleteModel,
          title: "un modèle",
          isLoading: useModel.isLoading,
        }}
      />
    </Container>
  );
}
