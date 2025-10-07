import { ModalAddEditModel } from "@/components/ui/Modals";
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import { _getTemplates } from "@/utils/apiFunctions";
import React from "react";
import { Col, Container, Dropdown, Image, Row, Spinner, Table } from "react-bootstrap";
import { Link, useOutletContext } from "react-router-dom";

interface ContextType {
  shops: ShopType[]
}

export default function ModelsPage() {
  const {shops} = useOutletContext<ContextType>()
  const [models, setModels] = React.useState<TemplateType[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<TemplateType>({} as TemplateType);
  const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  // const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    _getTemplates(setModels);
  }, []);

  // const handleShowAddModal = () => {
  //   setSelectedModel(null);
  //   setShowAddEditModal(true);
  // };

  const handleShowEditModal = (model: TemplateType) => {
    setSelectedModel(model);
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setSelectedModel({} as TemplateType);
    _getTemplates(setModels);
  };

  // const handleShowDeleteModal = (model: TemplateType) => {
  //   // setSelectedModel(model);
  //   setShowDeleteModal(true);
  // };

  // const handleCloseDeleteModal = () => {
  //   setShowDeleteModal(false);
  //   setSelectedModel(null);
  // };

  // const handleDeleteModel = async () => {
  //   if (!selectedModel) return;
  //   setIsLoading(true);
  //   try {

  //     const response = await templatesServiceInstance.deleteTemplate(selectedModel.id);
  //     if (response &&response.ok) {
  //       handleCloseDeleteModal();
  //       _getTemplates(setModels);
  //     } else {
  //       console.error("Erreur lors de la suppression du modèle");
  //     }
  //   } catch (err) {
  //     console.error("Erreur lors de la suppression du modèle:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const shopList = shops.map((item: ShopType) => ({ label: item.name, value: item.id }));

  const modalAddEditModelProps = { showAddEditModal, handleCloseAddEditModal, selectedModel, setSelectedModel, shopList };
  // const modalDeleteModelProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, modelName: selectedModel?.name, handleDelete: handleDeleteModel, isLoading };

  return (
    <Container fluid className="relative p-0">
      <Row className="bg-light sticky-top d-flex justify-content-between align-items-center w-100 gx-0 ">
        <Col xs={2} sm={1} className="pt-2">
          <Link to="/tableau-de-bord" className="text-muted">
            <i className="fa-solid fa-circle-arrow-left fs-3"></i>
          </Link>
        </Col>
        <Col xs={8} sm={10}>
          <h3 className="pt-3 pb-2 mb-0">Gestion des Modèles</h3>
        </Col>
        <Col xs={2} sm={1}></Col>
      </Row>
      <Container>
        {models.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped hover responsive="sm" className=" shadow">
            <thead className="sticky-sm-top ">
              <tr>
                <th className="py-3">Nom</th>
                <th className="py-3">Miniature</th>
                <th className="py-3">Magasin</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => {
                // Récupérer les noms des magasins basés sur les IDs
                const shopNames = model.shopIds
                  .map(shopId => shops.find(shop => shop.id === shopId)?.name)
                  .filter(name => name !== undefined)
                  .join(', ');
              return(
                <tr key={model.id} className="align-middle">
                  <td>{model.name}</td>
                  <td>
                    <Image
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/uploads/miniatures/${model.categoryId}/${model.image}`}
                      alt={model.name}
                      width={100}
                      height={100}
                    />
                  </td>
                  <td>{shopNames}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant='transparent'
                        id={`dropdown-model-${model.id}`}
                        className='border-0 no-chevron'
                      >
                        <b>
                          <i className='fa-solid fa-ellipsis-vertical'></i>
                        </b>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align='end'>
                        <Dropdown.Item onClick={() => handleShowEditModal(model)}>
                          <i className='fa fa-store me-2'></i> Attribuer un/des magasins ou modifier le nom
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              )})}
            </tbody>
          </Table>
        )}
      </Container>
  
      <ModalAddEditModel modalAddEditModelProps={modalAddEditModelProps} />
    </Container>
  );
}
