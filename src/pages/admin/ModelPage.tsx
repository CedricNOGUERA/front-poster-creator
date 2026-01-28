// import { ModalAddEditModel } from "@/components/ui/Modals";
// import templatesServiceInstance from "@/services/TemplatesServices";
import { ImagemodelType, ModelType } from "@/types/modelType";
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import { _deleteModel, _deleteModels, _getAllImagesModels, _getImagesModels, _getModels, _getTemplates } from "@/utils/apiFunctions";
import React from "react";
import { Button, Col, Container, Dropdown, Image, Modal, Row, Spinner, Table } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { FaEllipsisVertical, FaStore, FaTrash } from "react-icons/fa6";
import { useOutletContext } from "react-router-dom";
import dimensions from "@/data/dimensions.json";
import modelsServiceInstance from "@/services/modelsServices";
import { _showToast } from "@/utils/notifications";
import { ToastDataType } from "@/types/DiversType";

interface ContextType {
  shops: ShopType[]
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>> 
  toggleShow: () => void
}

export default function ModelsPage() {
    
  const {setToastData, toggleShow, } = useOutletContext<ContextType>()
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [models, setModels] = React.useState<ModelType[]>([]);
  const [imageModels, setImageModels] = React.useState<ImagemodelType[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<ModelType>({} as ModelType);
  // const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const [filteredModels, setFilteredModels] = React.useState<any[]>([]);


  React.useEffect(() => {
    _getTemplates(setTemplates);
    _getModels(setModels);
    _getAllImagesModels(setImageModels);
  }, []);
  React.useEffect(() => {
   
  }, []);
  // React.useEffect(() => {
  //   setFilteredModels(
  //       models.filter((model) =>
  //         selectedModel.id === model.templateId).map((model) => model.id)
  //   );
  // }, [selectedModel]);


  // const handleShowAddModal = () => {
  //   setSelectedModel({} as TemplateType);
  //   setShowAddEditModal(true);
  // };

  // const handleShowEditModal = (model: ModelType) => {
  //   setSelectedModel(model);
  //   setShowAddEditModal(true);
  // };

  // const handleCloseAddEditModal = () => {
  //   setShowAddEditModal(false);
  //   setSelectedModel({} as ModelType);
  //   _getTemplates(setTemplates);
  // };

  const handleShowDeleteModal = (model: ModelType) => {
    setSelectedModel(model);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedModel({} as ModelType);
    setShowDeleteModal(false);
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;
    setIsLoading(true);
    try {
      const response = await modelsServiceInstance.deleteModel(
        selectedModel.id,
      );
      handleCloseDeleteModal();
      _getModels(setModels);
      _getAllImagesModels(setImageModels);

      _showToast(true, "Suppression réussie", setToastData, toggleShow, 3000);

      console.log(response);
    } catch (err) {
      console.error("Erreur lors de la suppression du modèle:", err);

      _showToast(
        false,
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du modèle",
        setToastData,
        toggleShow,
        3000,
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // const modalAddEditModelProps = { showAddEditModal, handleCloseAddEditModal, selectedModel, setSelectedModel, shopList };
  // const modalDeleteModelProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, modelName: selectedModel?.name, handleDelete: handleDeleteModel, isLoading };

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
                <th className="py-3">Id</th>
                <th className="py-3">Nom</th>
                <th className="py-3">Dimension</th>
                <th className="py-3">Miniature</th>
                {/* <th className="py-3">Magasin</th> */}
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, indx) =>{ 

                const templateData = templates &&templates.find((temp) => temp.categoryId === model.categoryId && temp.id === model.templateId );
                const modelImage = imageModels.find((img) => img.modelId === model.id && img.categoryId === model.categoryId);
                const dimension = dimensions.find((dim) => dim.id === model.dimensionId);
                const factor = dimension && 120/dimension?.width
               
                return(
                 <tr key={indx} className="align-middle">
                  <td>{model.id}</td>
                  <td>{templateData?.name}</td>
                  <td>{dimension?.name}</td>
                  <td>
                    <Image
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/uploads/modelMiniature/${model.id}/${modelImage?.name}`}
                      alt={`Miniature du model #${model.id}`}
                      width={dimension && factor && dimension?.width*factor}
                      height={dimension && factor && dimension?.height*factor}
                      />
                  </td>
                  {/* <td>{model.id}</td> */}
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
                        {/* <Dropdown.Item 
                        // onClick={}
                          className="d-flex align-items-center"
                          >
                          <FaStore className="me-2" />                          
                          Attribuer un/des magasins ou modifier le nom
                        </Dropdown.Item> */}
                        <Dropdown.Item 
                        onClick={() => handleShowDeleteModal(model)}
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
  
      {/* <ModalAddEditModel modalAddEditModelProps={modalAddEditModelProps} /> */}
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
            if(selectedModel){
              handleDeleteModel()
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
