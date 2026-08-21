import {
  ModalAddDimension,
  ModalDeleteDimension,
  ModalStatusDimension,
} from "@/components/ui/Modals";
import AddButton from "@/components/ui/table/AddButton";
import useDimension from "@/hook/useDimension";
import TableHeader from "@/components/ui/table/TableHeader";
import { Container, Dropdown, Table } from "react-bootstrap";
import dimensions from "@/data/dimensions.json";
import { DimensionType } from "@/types/DimensionType";
import { FaCheck, FaEllipsisVertical, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

export default function DimensionPage() {
  const {
    isLoading,
    columnsData,
    dimensionFormData,
    setDimensionFormData,
    selectedStatus,

    handleAddDimension,
    handleStatusDimension,
    handleDeleteDimension,

    showAddModal,
    showStatusModal,
    showDeleteModal,
    handleShowAddModal,
    handleCloseAddModal,
    handleShowStatusModal,
    handleCloseStatusModal,
    handleShowDeleteModal,
    handleCloseDeleteModal,
  } = useDimension();

  const modalAddDimensionProps = {
    isLoading,
    showAddModal,
    handleCloseAddModal,
    dimensionFormData,
    setDimensionFormData,
    handleAddDimension,
  };

  const modalStatusDimensionProps = {
    isLoading,
    showStatusModal,
    handleCloseStatusModal,
    selectedStatus,
    handleStatusDimension,
  };
  const modalDeleteDimensionProps = {
    isLoading,
    showDeleteModal,
    handleCloseDeleteModal,
    handleDeleteDimension,
  };

  const dimensionDisplay = (dimensions: DimensionType[]) => {
    return dimensions.map((dimension) => (
      <tr key={dimension.id} className="align-middle">
        <td>{dimension.id}</td>
        <td>{dimension?.helper_dimensions}</td>
        <td>{dimension?.name}</td>
        <td>{dimension?.orientation}</td>
        <td>
          {dimension?.status ? (
            <FaCheck className="me-2" size={20} color="#38c42b" />
          ) : (
            <FaTimes className="me-2" size={20} color="#ff002b" />
          )}
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle
              variant="transparent"
              id={`dropdown-model-${dimension.id}`}
              className="border-0 no-chevron"
            >
              <b>
                <FaEllipsisVertical />
              </b>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {dimension.status ? (
                <Dropdown.Item
                  onClick={() =>
                    handleShowStatusModal(dimension.id, dimension.status)
                  }
                  className="d-flex align-items-center text-warning"
                >
                  <FaTimes className="me-2" size={16} />
                  Désactiver
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={() =>
                    handleShowStatusModal(dimension.id, dimension.status)
                  }
                  className="d-flex align-items-center text-success"
                >
                  <FaCheck className="me-2" size={16} />
                  Activer
                </Dropdown.Item>
              )}
              <Dropdown.Item
                onClick={() => handleShowDeleteModal(dimension.id)}
                className="d-flex align-items-center text-danger"
              >
                <FaTrash className="me-2" size={16} />
                Supprimer
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ));
  };

  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Dimensions</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <AddButton handleShowAdd={handleShowAddModal} title="une dimension" />
        </div>
        <Table striped hover responsive="sm" className="shadow">
          <TableHeader columnsData={columnsData} />
          <tbody>{dimensionDisplay(dimensions)}</tbody>
        </Table>
      </Container>

      <ModalAddDimension modalAddDimensionProps={modalAddDimensionProps} />
      <ModalStatusDimension
        modalStatusDimensionProps={modalStatusDimensionProps}
      />
      <ModalDeleteDimension
        modalDeleteDimensionProps={modalDeleteDimensionProps}
      />
    </Container>
  );
}
