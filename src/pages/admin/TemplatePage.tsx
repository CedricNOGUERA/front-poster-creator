
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import { _getTemplates } from "@/utils/apiFunctions";
import React from "react";
import { Alert, Button, Col, Container, Dropdown, Image, Modal, Row, Spinner, Table } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { FaEllipsisVertical, FaTrash } from "react-icons/fa6";
import { useOutletContext } from "react-router-dom";
import { _showToast } from "@/utils/notifications";
import { ToastDataType } from "@/types/DiversType";
import templatesServiceInstance from "@/services/TemplatesServices";
import { AxiosError } from "axios";
import SearchBar from "@/components/dashBoardComponents/SearchBar";

interface ContextType {
  shops: ShopType[]
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>> 
  toggleShow: () => void
}

export default function TemplatePage() {
    
  const {setToastData, toggleShow, } = useOutletContext<ContextType>()
  const [allTemplates, setAllTemplates] = React.useState<TemplateType[]>([]);
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<TemplateType>({} as TemplateType);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");


  React.useEffect(() => {
    _getTemplates(setAllTemplates);
    _getTemplates(setTemplates);
  }, []);
  

  const templateData = React.useMemo(() => {
    if (searchTerm.trim() === "") {
      // Si la recherche est vide, afficher tous les modèles
      return allTemplates
    }

    const lowerTerm = searchTerm.toLowerCase().trim();

    return allTemplates.filter((temp) => {

      // Vérifier si le terme de recherche correspond à l'un des champs
      const matchesId = temp.id && temp.id.toString().includes(lowerTerm);
      const matchesTemplateName = temp?.name.toLowerCase().includes(lowerTerm);

      return matchesId || matchesTemplateName;
    });

  }, [searchTerm, allTemplates]);

  const handleShowDeleteModal = (temp: TemplateType) => {
    setSelectedModel(temp);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedModel({} as TemplateType);
    setShowDeleteModal(false);
  };

  const handleDeleteTemplate = async () => {
    if (!selectedModel) return;
    setIsLoading(true);
    try {
   
      const response = await templatesServiceInstance.deleteTemplate(
        selectedModel.id,
      );
      handleCloseDeleteModal();
        _getTemplates(setTemplates);
      _showToast(true, "Suppression réussie", setToastData, toggleShow, 3000);

      console.log(response);
    } catch (err: unknown) {
      console.error("Erreur lors de la suppression du modèle:", err);
        if(err instanceof AxiosError){
      _showToast(
        false,
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Erreur lors de la suppression du modèle",
        setToastData,
        toggleShow,
        5000,
      );
    }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="relative p-0">
      <Row className="bg-light sticky-top d-flex justify-content-between align-items-center w-100 gx-0 ">
        <Col xs={2} sm={1} className="pt-2">
        </Col>
        <Col xs={8} sm={10}>
          <h3 className="pt-3 pb-2 mb-0">Gestion des templates</h3>
        </Col>
        <Col xs={2} sm={1}></Col>
      </Row>
      <SearchBar seachBarProps={{searchTerm, setSearchTerm, data: templates}} />
       <Container>
        {templateData.length === 0 ? (
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
                <th className="py-3">Miniature</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templateData.map((temp, indx) =>{ 
               
                return(
                 <tr key={indx} className="align-middle">
                  <td>{temp.id}</td>
                  <td>{temp?.name}</td>
                  <td>
                    <Image
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/uploads/miniatures/${temp.categoryId}/${temp?.image}`}
                      alt={`Miniature du temp #${temp.id}`}
                      width={100}
                      height={100}
                      />
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant='transparent'
                        id={`dropdown-temp-${temp.id}`}
                        className='border-0 no-chevron'
                      >
                        <b>
                          <FaEllipsisVertical />
                        </b>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align='end'>
                        <Dropdown.Item 
                        onClick={() => handleShowDeleteModal(temp)}
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

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer un template</Modal.Title>
        </Modal.Header>
        <Modal.Body>Etes-vous sûr de vouloir supprimer ce template ?
            <Alert variant="danger" className="mt-3">

            ⚠️ Ce template est utilisé par des modèles.
            Voulez-vous vraiment le supprimer ?
            (Les modèles associés seront également supprimés)
            </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() =>{
            if(selectedModel){
              handleDeleteTemplate()
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
