import { ImagemodelType, ModelResultType, ModelType } from "@/types/modelType";
import { ShopType } from "@/types/ShopType";
import { TemplateType } from "@/types/TemplatesType";
import { _getAllImagesModels, _getTemplates } from "@/utils/apiFunctions";
import React from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { FaEllipsisVertical, FaTrash, FaX } from "react-icons/fa6";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import dimensions from "@/data/dimensions.json";
import modelsServiceInstance from "@/services/modelsServices";
import { _expiredSession, _showToast } from "@/utils/notifications";
import { ToastDataType } from "@/types/DiversType";
import { AxiosError } from "axios";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { _buildPaginationItems } from "@/components/ui/pagination";

interface ContextType {
  shops: ShopType[];
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  toggleShow: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function ModelsPage() {
  const [params] = useSearchParams();
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout);
  const navigate = useNavigate();
  const { setToastData, toggleShow } = useOutletContext<ContextType>();
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [paginatedModels, setPaginatedModels] = React.useState<ModelResultType>(
    {} as ModelResultType,
  );
  const [imageModels, setImageModels] = React.useState<ImagemodelType[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<ModelType>(
    {} as ModelType,
  );
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "10",
  );
  const [id, setId] = React.useState<string>(params.get("id") || "");
  const [template, setTemplate] = React.useState<string>(
    params.get("template") || "",
  );
  const [dimension, setDimension] = React.useState<string>(
    params.get("dimension") || "",
  );
  const [debouncedFilters, setDebouncedFilters] = React.useState({
    page,
    perPage,
    id,
    template,
    dimension,
  });

  const isFiltering =
    id === "" &&
    (template === "template" || template === "") &&
    (dimension === "" || dimension === "dimension");

  const totalPages = Math.ceil(paginatedModels?.total / parseInt(perPage));
  const currentPage = parseInt(page);

  // Chargement initial des données
  React.useEffect(() => {
    _getTemplates(setTemplates);
    _getAllImagesModels(setImageModels);
  }, []);

  //  const models = React.useMemo(() => {
  //   if (searchTerm.trim() === "") {
  //     return paginatedModels?.models;
  //   }

  //   const lowerTerm = searchTerm.toLowerCase().trim();

  //   return paginatedModels?.models.filter((model) => {
  //     const templateData = templates.find(
  //       (temp) =>
  //         temp.categoryId === model.categoryId &&
  //         temp.id === model.templateId,
  //     );
  //   // return allModels.filter((model) => {
  //   //   const templateData = templates.find(
  //   //     (temp) =>
  //   //       temp.categoryId === model.categoryId &&
  //   //       temp.id === model.templateId,
  //   //   );

  //     const dimension = dimensions.find(
  //       (dim) => dim.id === model.dimensionId,
  //     );

  //     const matchesId = model.id.toString().includes(lowerTerm);
  //     const matchesTemplateName = templateData?.name.toLowerCase().includes(lowerTerm) || false;
  //     const matchesDimension = dimension?.name.toLowerCase().includes(lowerTerm) || false;

  //     return matchesId || matchesTemplateName || matchesDimension;
  //   });
  // }, [searchTerm, paginatedModels?.models, templates]);

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
      await modelsServiceInstance.deleteModel(selectedModel.id);
      handleCloseDeleteModal();

      // Recharger les données originales après suppression
      // _getModels(setAllModels);
      _getAllImagesModels(setImageModels);
      getPaginatedModels(page, perPage, id, template, dimension,);
       const params = new URLSearchParams();
       params.set("page", page)
       params.set("perPage", perPage)

       navigate(`/tableau-de-bord/modeles?${params.toString()}`);
      _showToast(true, "Suppression réussie", setToastData, toggleShow, 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression du modèle:", err);
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          _expiredSession(
            (success, message, delay) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate,
          );
        }
      } else {
        _showToast(
          false,
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression du modèle",
          setToastData,
          toggleShow,
          3000,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters({
        page,
        perPage,
        id,
        template,
        dimension,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, id, template, dimension, currentPage]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.id) params.set("id", debouncedFilters.id);
    if (
      debouncedFilters.template !== "template" &&
      debouncedFilters.template !== ""
    )
      params.set("template", debouncedFilters.template);
    if (
      debouncedFilters.dimension !== "dimensions" &&
      debouncedFilters.dimension !== ""
    )
      params.set("dimension", debouncedFilters.dimension);

    getPaginatedModels(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.id,
      debouncedFilters.template,
      debouncedFilters.dimension,
    );

    navigate(`/tableau-de-bord/modeles?${params.toString()}`);
  }, [debouncedFilters, navigate]);

  const getPaginatedModels = async (
    page: string,
    perPage: string,
    id: string,
    template: string,
    dimension: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await modelsServiceInstance.getPaginatedModels(
        page,
        perPage,
        id,
        template,
        dimension,
      );
      setPaginatedModels(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const items = _buildPaginationItems({
    currentPage,
    totalPages,
    onPageChange: (p) => setPage(`${p}`),
  });
  const resetForm = () => {
    setId("");
    setTemplate("");
    setDimension("");
  };

  const limitedElements = (value: string) => {
    const newPerPage = parseInt(value ?? "10");
    const oldPerPage = parseInt(perPage);

    const newPage =
      Math.floor(((currentPage - 1) * oldPerPage) / newPerPage) + 1;

    setPerPage(`${newPerPage}`);
    setPage(`${newPage}`);
    setPerPage(value ?? "10");
  };

  // console.log(models)

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
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped hover responsive="sm" className="shadow">
            <thead className="sticky-sm-top text-start">
              <tr>
                <th className="py-3">Id</th>
                <th className="py-3">Template</th>
                <th className="py-3">Dimension</th>
                <th className="py-3">Miniature</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="py-3">
                  <Form.Group controlId="id">
                    <Form.Control
                      type="text"
                      placeholder="id.."
                      value={id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setId(e.target.value);
                        setPage("1");
                      }}
                    />
                  </Form.Group>
                </th>
                <th className="py-3">
                  <Form.Group controlId="template">
                    <Form.Select
                      aria-label="template"
                      value={template}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setTemplate(e.target.value);
                        setPage("1");
                      }}
                    >
                      <option value="">template...</option>
                      {templates?.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </th>
                <th className="py-3">
                  <Form.Group controlId="dimension">
                    <Form.Select
                      aria-label="dimension"
                      value={dimension}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setDimension(e.target.value);
                        setPage("1");
                      }}
                    >
                      <option value="">dimension...</option>
                      {dimensions?.map((dimension) => (
                        <option key={dimension.id} value={dimension.id}>
                          {dimension.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </th>

                <th className="py-3"></th>

                <th className="py-3">
                  <Button onClick={() => resetForm()} disabled={isFiltering}>
                    <div className="flex items-center">
                      <FaX size={10} className="me-1" />
                      <small>Réinitialiser</small>
                    </div>
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedModels?.models?.map((model, indx) => {
                const templateData =
                  templates &&
                  templates.find(
                    (temp) =>
                      temp.categoryId === model.categoryId &&
                      temp.id === model.templateId,
                  );
                const modelImage = imageModels.find(
                  (img) =>
                    img.modelId === model.id &&
                    img.categoryId === model.categoryId,
                );
                const dimension = dimensions.find(
                  (dim) => dim.id === model.dimensionId,
                );
                const factor = dimension && 120 / dimension?.width;
                const baseSlug = `${API_URL}/uploads/modelMiniature/`;

                return (
                  <tr key={indx} className="align-middle">
                    <td>{model.id}</td>
                    <td>{templateData?.name}</td>
                    <td>{dimension?.name}</td>
                    <td>
                      <Image
                        loading="lazy"
                        src={`${baseSlug}${model.id}/${modelImage?.name}`}
                        alt={`Miniature du model #${model.id}`}
                        width={dimension && factor && dimension?.width * factor}
                        height={
                          dimension && factor && dimension?.height * factor
                        }
                      />
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="transparent"
                          id={`dropdown-model-${model.id}`}
                          className="border-0 no-chevron"
                        >
                          <b>
                            <FaEllipsisVertical />
                          </b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
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
                );
              })}
            </tbody>
          </Table>
        )}
        <div className="d-flex justify-content-between">
          <Pagination>
            <Pagination.First onClick={() => setPage("1")} />
            <Pagination.Prev
              onClick={() => {
                const prevPage = parseInt(page) - 1;
                if (parseInt(page) > 1) {
                  setPage(`${prevPage}`);
                }
              }}
            />

            {items}
            <Pagination.Next
              onClick={() => {
                const nextPage = parseInt(page) + 1;
                if (parseInt(page) < totalPages) setPage(`${nextPage}`);
              }}
            />
            <Pagination.Last onClick={() => setPage(`${totalPages}`)} />
          </Pagination>
          <div className="">
            <Form.Select
              aria-label="perPage"
              onChange={(e) => {
                limitedElements(e.currentTarget.value);
              }}
            >
              <option>{perPage}</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </div>
        </div>
      </Container>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer un modèle</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce modèle ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (selectedModel) {
                handleDeleteModel();
              }
            }}
          >
            {isLoading ? (
              <>
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  className="me-2"
                />
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
