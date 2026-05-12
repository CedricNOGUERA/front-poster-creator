import { ResultStoreType, StoresType } from "@/types/StoresType";
import React from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Modal,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { ShopType } from "@/types/ShopType";
import { FaEllipsisVertical, FaPencil, FaTrash, FaX } from "react-icons/fa6";
import storeServiceInstance from "@/services/StoreServices";
import { _buildPaginationItems } from "@/components/ui/pagination";
import TableLoader from "@/components/ui/squeleton/TableLoader";
import {
  _handleCloseDeleteModal,
  _handleCloseEditModal,
  _handleShowDeleteModal,
  _handleShowEditModal,
} from "@/utils/modalFunction";
import { ToastDataType } from "@/types/DiversType";

interface ContextStoreType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export default function StorePage() {
  
  const API_URL = import.meta.env.VITE_API_URL;
  const { shops, toggleShow, setToastData } = useOutletContext<ContextStoreType>();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [paginatedStores, setPaginatedStores] = React.useState<ResultStoreType>(
    {} as ResultStoreType,
  );
  const [selectedStore, setSelectedStore] = React.useState<StoresType>(
    {} as StoresType,
  );
  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "20",
  );
  const [id, setId] = React.useState<string>(params.get("id") || "");
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [company, setCompany] = React.useState<string>(
    params.get("company") || "",
  );
  const [debouncedFilters, setDebouncedFilters] = React.useState({
    page,
    perPage,
    id,
    name,
    company,
  });
  const isFiltering = id === "" && company === "" && name === "";

  const totalPages = Math.ceil(paginatedStores?.total / parseInt(perPage));
  const currentPage = parseInt(page);

  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters({
        page,
        perPage,
        id,
        name,
        company,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, id, name, company, currentPage]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.id) params.set("id", debouncedFilters.id);
    if (debouncedFilters.name) params.set("name", debouncedFilters.name);
    if (debouncedFilters.company)
      params.set("company", debouncedFilters.company);

    getPaginatedStores(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.id,
      debouncedFilters.name,
      debouncedFilters.company,
    );

    navigate(`/tableau-de-bord/magasins?${params.toString()}`);
  }, [debouncedFilters, navigate]);

  const getPaginatedStores = async (
    page: string,
    perPage: string,
    id: string,
    name: string,
    company: string,
  ) => {
    setIsLoading(true);

    try {
      const response = await storeServiceInstance.paginatedStores(
        page,
        perPage,
        id,
        name,
        company,
      );

      setPaginatedStores(response);
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
    setName("");
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

  const updateStore = async (id: number, data: Partial<StoresType>) => {
    setIsLoading(true);
    try {
      const response = await storeServiceInstance.patchStore(id, data);
      console.log(response);
      _handleCloseEditModal(setSelectedStore, setShowEditModal);
      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
      );
       setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Magasin modifiée avec succès !',
        })
        toggleShow()
    } catch (error) {
      console.error(error);
       setToastData({
          bg: 'danger',
          position: 'top-end',
          delay: 6000,
          icon: 'fa fa-check-circle',
          message: `Erreur s'est produite lors de la modification du magasin`
        })
        toggleShow()
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStore = async (id: number) => {
    setIsLoading(true);
    try {
      await storeServiceInstance.deleteStore(id);

      _handleCloseDeleteModal(setSelectedStore, setShowDeleteModal);
      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
      );
      setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Magasin supprimé avec succès !',
        })
        toggleShow()
    } catch (error) {
      console.error(error);
      setToastData({
          bg: 'danger',
          position: 'top-end',
          delay: 6000,
          icon: 'fa fa-check-circle',
          message: `Erreur s'est produite lors de la suppression du magasin`
        })
        toggleShow()
    }
  };
  // const path = window.location.pathname;

  // const trigger = path.split("/").filter(Boolean).pop();

  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Magasin</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="primary"
            className="rounded d-flex align-items-center gap-1"
            // onClick={handleShowAdd}
          >
            <FaPlusCircle /> <span>un magasin</span>
          </Button>
        </div>
        <Table striped hover responsive="sm" className="shadow">
          <thead className="sticky-sm-top ">
            <tr>
              <th>Id</th>
              <th>Enseigne</th>
              <th>Magasin</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th className="py-3">
                <Form.Group controlId="id">
                  <Form.Control
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
                <Form.Group controlId="company">
                  <Form.Select
                    value={company}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setCompany(e.target.value);
                      setPage("1");
                    }}
                  >
                    <option value="">enseigne...</option>
                    {shops?.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="id">
                  <Form.Control
                    placeholder="Nom.."
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3" style={{ width: "150px" }}>
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
            {paginatedStores?.stores?.map((store) => {
              const shop = shops.find((shop) => shop.id === store.companyId);
              return (
                <tr key={store.id} className="align-middle">
                  <td>{store.id}</td>
                  <td>
                    <img
                      src={API_URL + "/" + shop?.cover || ""}
                      alt={shop?.name}
                      width={50}
                    />
                  </td>
                  <td>{store?.name}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="transparent"
                        id="dropdown-basic"
                        className="border-0 no-chevron"
                      >
                        <FaEllipsisVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item
                          onClick={() => {
                            _handleShowEditModal(
                              setSelectedStore,
                              store,
                              setShowEditModal,
                            );
                          }}
                        >
                          <FaPencil className="text-success" /> Modifier
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedStore(store);
                            _handleShowDeleteModal(
                              setSelectedStore,
                              store,
                              setShowDeleteModal,
                            );
                          }}
                          className="text-danger"
                        >
                          <FaTrash /> Supprimer
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    
                  </td>
                </tr>
              );
            })}
            {isLoading && <TableLoader lengthTr={5} lengthTd={4} />}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          <Pagination className="text-dark">
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <Modal
          show={showEditModal}
          onHide={() =>
            _handleCloseEditModal(setSelectedStore, setShowEditModal)
          }
        >
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              updateStore(selectedStore.id, {
                name: selectedStore.name,
                companyId: selectedStore.companyId,
              });
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <FaPencil className="fs-4 text-success me-2" /> Modifier un
                magasin
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Modifier le nom"
                  value={selectedStore.name || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedStore((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Enseigne</Form.Label>
                <Form.Group controlId="company">
                  <Form.Select
                    value={selectedStore.companyId || ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedStore((prev) => ({
                      ...prev,
                      companyId: parseInt(e.target.value, 10),
                    }))
                  }
                  >
                    <option value="">enseigne...</option>
                    {shops?.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  _handleCloseEditModal(setSelectedStore, setShowEditModal)
                }
              >
                Annuler
              </Button>
              <Button type="submit" className="d-flex align-items-center gap-1">
                {isLoading && <Spinner size="sm" />}
                Modifier
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={showDeleteModal}
          onHide={() =>
            _handleCloseDeleteModal(setSelectedStore, setShowDeleteModal)
          }
        >
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              deleteStore(selectedStore.id);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <FaTrashAlt className="fs-4 text-danger me-2" /> Supprimer un
                magasin
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                  <b>{selectedStore.name}</b>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  _handleCloseDeleteModal(setSelectedStore, setShowDeleteModal)
                }
              >
                Annuler
              </Button>
              <Button variant="danger" type="submit"  className="d-flex align-items-center gap-1">
                {isLoading && <Spinner size="sm" />}
                Supprimer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Container>
  );
}
