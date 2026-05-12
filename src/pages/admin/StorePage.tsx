import { ResultStoreType, StoresType } from "@/types/StoresType";
import React from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Pagination,
  Table,
} from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { ShopType } from "@/types/ShopType";
import {
  FaEllipsisVertical,
  FaPencil,
  FaTrash,
  FaX,
} from "react-icons/fa6";
import storeServiceInstance from "@/services/StoreServices";
import { _buildPaginationItems } from "@/components/ui/pagination";
import TableLoader from "@/components/ui/squeleton/TableLoader";
import {
  _handleCloseAddModal,
  _handleCloseDeleteModal,
  _handleCloseEditModal,
  _handleShowAddModal,
  _handleShowDeleteModal,
  _handleShowEditModal,
} from "@/utils/modalFunction";
import { ToastDataType } from "@/types/DiversType";
import { ModalAddStore, ModalDeleteStore, ModalUpdateStore } from "@/components/ui/Modals";

interface ContextStoreType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export default function StorePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { shops, toggleShow, setToastData } =
    useOutletContext<ContextStoreType>();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [isLoadingDisplay, setIsLoadingDisplay] = React.useState<boolean>(false);
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

  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
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
    setIsLoadingDisplay(true);

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
      setIsLoadingDisplay(false);
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

  const addStore = async () => {
    setIsLoading(true);
    const storeFormData = {
      name: selectedStore.name,
      companyId: selectedStore.companyId,
    };
    try {
      await storeServiceInstance.createStore(storeFormData);

      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
      );
      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin créé avec succès !",
      });
      toggleShow();
      _handleCloseAddModal(setSelectedStore, setShowAddModal);
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message:
          "Une erreur s'est produite lors de la création du magasin. Veuillez Réessayer",
      });
      toggleShow();
    } finally {
      setIsLoading(false);
    }
  };

  const updateStore = async (id: number, data: Partial<StoresType>) => {
    setIsLoading(true);
    try {
      await storeServiceInstance.patchStore(id, data);
      
      _handleCloseEditModal(setSelectedStore, setShowEditModal);
      getPaginatedStores(
        debouncedFilters.page,
        debouncedFilters.perPage,
        debouncedFilters.id,
        debouncedFilters.name,
        debouncedFilters.company,
      );
      setToastData({
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin modifiée avec succès !",
      });
      toggleShow();
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message: `Une erreur s'est produite lors de la modification du magasin. Veuillez Réessayer`,
      });
      toggleShow();
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
        bg: "success",
        position: "top-end",
        delay: 3000,
        icon: "fa fa-check-circle",
        message: "Magasin supprimé avec succès !",
      });
      toggleShow();
    } catch (error) {
      console.error(error);
      setToastData({
        bg: "danger",
        position: "top-end",
        delay: 6000,
        icon: "fa fa-circle-xmark",
        message: `Une erreur s'est produite lors de la suppression du magasin`,
      });
      toggleShow();
    }finally{
      setIsLoading(true);
    }
  };
  // const path = window.location.pathname;

  // const trigger = path.split("/").filter(Boolean).pop();

  const modalAddStoreProps = {
    showAddModal,
    setSelectedStore,
    setShowAddModal,
    addStore,
    selectedStore,
    shops,
    isLoading,
  };

  const modalUpdateStoreProps =  {
    showEditModal,
    setSelectedStore,
    setShowEditModal,
    updateStore,
    selectedStore,
    shops,
    isLoading,
  }

  const modalDeleteStoreProps = {showDeleteModal, selectedStore, setSelectedStore, setShowDeleteModal, deleteStore, isLoading}


  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Magasin</h3>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="primary"
            className="rounded d-flex align-items-center gap-1"
            onClick={() => _handleShowAddModal(setShowAddModal)}
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
            {isLoadingDisplay && <TableLoader lengthTr={5} lengthTd={4} />}
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
        <ModalAddStore modalAddStoreProps={modalAddStoreProps} />
        <ModalUpdateStore modalUpdateStoreProps={modalUpdateStoreProps} /> 
        <ModalDeleteStore modalDeleteStoreProps={modalDeleteStoreProps} />
      </Container>
    </Container>
  );
}
