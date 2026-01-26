import { ModalAddEditModel } from "@/components/ui/Modals";
// import templatesServiceInstance from "@/services/TemplatesServices";
import { ModelType } from "@/types/modelType";
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import { _deleteModel, _deleteModels, _getModels, _getTemplates } from "@/utils/apiFunctions";
import React from "react";
import { Button, Col, Container, Dropdown, Image, Modal, Row, Spinner, Table } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { FaEllipsisVertical, FaStore, FaTrash } from "react-icons/fa6";
import { useOutletContext } from "react-router-dom";

interface ContextType {
  shops: ShopType[]
}

export default function ModelsPage() {
  const {shops} = useOutletContext<ContextType>()
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [models, setModels] = React.useState<ModelType[]>([]);
  // const [selectedModel, setSelectedModel] = React.useState<ModelType>({} as ModelType);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>({} as TemplateType);
  const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filteredModels, setFilteredModels] = React.useState<any[]>([]);


  React.useEffect(() => {
    _getTemplates(setTemplates);
    _getModels(setModels);
  }, []);
  React.useEffect(() => {
    setFilteredModels(
        models.filter((model) =>
          selectedTemplate.id === model.templateId).map((model) => model.id)
    );
  }, [selectedTemplate]);


  // const handleShowAddModal = () => {
  //   setSelectedTemplate({} as TemplateType);
  //   setShowAddEditModal(true);
  // };

  const handleShowEditModal = (model: TemplateType) => {
    setSelectedTemplate(model);
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setSelectedTemplate({} as TemplateType);
    _getTemplates(setTemplates);
  };

  const handleShowDeleteModal = (model: TemplateType) => {
    setSelectedTemplate(model);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedTemplate({} as TemplateType);
    setShowDeleteModal(false);
  };

  // const handleDeleteModel = async () => {
  //   if (!selectedTemplate) return;
  //   setIsLoading(true);
  //   try {

  //     const response = await templatesServiceInstance.deleteTemplate(selectedTemplate.id);
  //     if (response &&response.ok) {
  //       handleCloseDeleteModal();
  //       _getTemplates(setTemplates);
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

  const modalAddEditModelProps = { showAddEditModal, handleCloseAddEditModal, selectedTemplate, setSelectedTemplate, shopList };
  // const modalDeleteModelProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, modelName: selectedTemplate?.name, handleDelete: handleDeleteModel, isLoading };

  return (
    <Container fluid className="relative p-0">
      <Row className="bg-light sticky-top d-flex justify-content-between align-items-center w-100 gx-0 ">
        <Col xs={2} sm={1} className="pt-2">
        </Col>
        <Col xs={8} sm={10}>
          <h3 className="pt-3 pb-2 mb-0">Gestion des Modèles</h3>
        </Col>
        <Col xs={2} sm={1}></Col>
      </Row>
      <Container>
        {templates.length === 0 ? (
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
              {templates.map((model) => {
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
                          <FaEllipsisVertical />
                        </b>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align='end'>
                        <Dropdown.Item onClick={() => handleShowEditModal(model)}
                          className="d-flex align-items-center"
                          >
                          <FaStore className="me-2" />                          
                          Attribuer un/des magasins ou modifier le nom
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShowDeleteModal(model)}
                          className="d-flex align-items-center text-danger"
                          >
                          <FaTrash className="me-2" size={16} />                          
                          Supprimer
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
      {/* <ModalGenericDelete modalGenericDeleteProps={modalDeleteModelProps} /> */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer un modèle</Modal.Title>
        </Modal.Header>
        <Modal.Body>Etes-vous sûr de vouloir supprimer ce modèle ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() =>{
            if(selectedTemplate){
              _deleteModels(filteredModels)
              // handleDeleteModel()
            }
          }}>
            {isLoading ? (
              <>
              <Spinner size="sm" animation="border" role="status" className="me-2"/>
                <span className="visually-hidden">Chargement...</span>
              </>
             
            ) : (
            <span>
              <FaTimesCircle className="me-2" />
              </span>
            )}
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
