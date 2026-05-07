// import SearchBar from "@/components/dashBoardComponents/SearchBar";
import { ModalGenericDelete } from "@/components/ui/Modals";
import { _buildPaginationItems } from "@/components/ui/pagination";
import { ModalAddUser } from "@/components/users/ModalUser";
import UsersServices from "@/services/UsersServices";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { ToastDataType } from "@/types/DiversType";
import { ShopType } from "@/types/ShopType";
import { ResultUserType, UserType } from "@/types/UserType";
// import { _getAllUsers } from "@/utils/apiFunctions";
import React from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Pagination,
  Table,
} from "react-bootstrap";
import { FaEllipsisVertical, FaPencil, FaTrash, FaX } from "react-icons/fa6";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import storeData from "@/data/store.json";

interface ContextShopSelectorType {
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
  shops: ShopType[];
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>;
}

export default function UserManager() {
  /* States
   *******************************************************************************************/
  const navigate = useNavigate();
  const { shops } = useOutletContext<ContextShopSelectorType>();
  const [params] = useSearchParams();

  // const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const userRole = userDataStore((state: UserDataType) => state.role);
  const userCompany = userDataStore((state: UserDataType) => state.company);
  const [paginatedUsers, setPaginatedUsers] = React.useState<ResultUserType>(
    {} as ResultUserType,
  );
  // const [allUsers, setAllUsers] = React.useState<UserType[]>([]);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  // const [searchTerm, setSearchTerm] = React.useState<string>("");

  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "10",
  );
  const [company, setCompany] = React.useState<string>(
    params.get("company") || "",
  );
  const [store, setStore] = React.useState<string>(params.get("store") || "");
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [email, setEmail] = React.useState<string>(params.get("email") || "");
  const [role, setRole] = React.useState<string>(params.get("role") || "");

  const [debouncedFilters, setDebouncedFilters] = React.useState({
    page,
    perPage,
    company,
    store,
    name,
    email,
    role,
  });

  const isFiltering =
    company === "" &&
    store === "" &&
    name === "" &&
    email === "" &&
    role === "";

  const totalPages = Math.ceil(paginatedUsers?.total / parseInt(perPage));
  const currentPage = parseInt(page);

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    // Redirection si l'utilisateur a le rôle "user"
    if (userRole === "user") {
      navigate("/editeur-de-bon-plan");
      return;
    }
    // _getAllUsers(setAllUsers, setIsLoading);
  }, [userRole, navigate]);

  // const users = React.useMemo(() => {
  //   if (searchTerm.trim() === "") {
  //     return allUsers;
  //   }

  //   const lowerTerm = searchTerm.toLowerCase().trim();

  //   return allUsers.filter((user) => {
  //     // const companyMatch = user.company.some((item) =>
  //     //   item.nameCompany.toLowerCase().includes(lowerTerm))
  //     const matchUserName = user.name.toLowerCase().includes(lowerTerm);
  //     const matchUserEmail = user.email.toLowerCase().includes(lowerTerm);
  //     const matchUserRole = user.role.toLowerCase().includes(lowerTerm);

  //     // const matchesId = model.id.toString().includes(lowerTerm);
  //     // const matchesTemplateName = templateData?.name.toLowerCase().includes(lowerTerm) || false;
  //     // const matchesDimension = dimension?.name.toLowerCase().includes(lowerTerm) || false;

  //     return matchUserName || matchUserEmail || matchUserRole;
  //   });
  // }, [searchTerm, allUsers]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters({
        page,
        perPage,
        company,
        store,
        name,
        email,
        role,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, company, store, name, email, role, currentPage]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.company)
      params.set("company", debouncedFilters.company);
    if (debouncedFilters.store) params.set("store", debouncedFilters.store);
    if (debouncedFilters.name) params.set("name", debouncedFilters.name);
    if (debouncedFilters.email) params.set("email", debouncedFilters.email);
    if (debouncedFilters.role) params.set("role", debouncedFilters.role);

    getPaginatedUsers(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.company,
      debouncedFilters.store,
      debouncedFilters.name,
      debouncedFilters.email,
      debouncedFilters.role,
    );

    navigate(`/tableau-de-bord/utilisateurs?${params.toString()}`);
  }, [debouncedFilters, navigate]);

  /* Functions
   *******************************************************************************************/
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const handleCloseAdd = () => {
    setShowAdd(false);
    setSelectedUser(null);
    getPaginatedUsers(page, perPage, company, store, name, email, role);

  };
  const handleShowAdd = () => {
    setSelectedUser(null);
    setShowAdd(true);
  };

  const handleShowEdit = (user: UserType) => {
    setSelectedUser(user);
    setShowAdd(true);
  };

  const deleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await UsersServices.deleteUser(id);
      if (response.ok) {
        handleCloseAdd();
        getPaginatedUsers(page, perPage, company, store, name, email, role);
        // _getAllUsers(setAllUsers, setIsLoading);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaginatedUsers = async (
    page: string,
    perPage: string,
    company: string,
    store: string,
    name: string,
    email: string,
    role: string,
  ) => {
    setIsLoading(true);

    try {
      const response = await UsersServices.getPaginatedUsers(
        page,
        perPage,
        company,
        store,
        name,
        email,
        role,
      );

      setPaginatedUsers(response);
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false)
    }
  };

  const items = _buildPaginationItems({
    currentPage,
    totalPages,
    onPageChange: (p) => setPage(`${p}`),
  });

  const resetForm = () => {
    setCompany("");
    setStore("");
    setName("");
    setEmail("");
    setRole("");
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

  const modalGenericDeleteProps = {
    show: showDelete,
    handleClose: handleCloseDelete,
    selectedId: selectedUserId,
    handleDelete: deleteUser,
    title: "l'utilisateur",
    isLoading,
  };

  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des utilisateurs</h3>
      {/* <SearchBar seachBarProps={{ searchTerm, setSearchTerm, data: users }} /> */}
      <Container>
        <Table striped hover responsive="sm" className="shadow">
          <thead className="sticky-sm-top text-start">
            <tr>
              <th>Enseigne</th>
              <th>Magasin</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <thead>
            <tr>
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
                <Form.Group controlId="store">
                  <Form.Select
                    value={store}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setStore(e.target.value);
                      setPage("1");
                    }}
                  >
                    <option value="">magasin...</option>
                    {storeData?.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="name">
                  <Form.Control
                    type="text"
                    placeholder="nom..."
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="email">
                  <Form.Control
                    type="text"
                    placeholder="email..."
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="role">
                  <Form.Control
                    type="text"
                    placeholder="rôle"
                    value={role}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRole(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3" style={{width: "150px"}}>
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
            {/* {users */}
            {paginatedUsers?.users
              ?.filter((user) => {
                // Si l'utilisateur connecté est super_admin, il voit tous les utilisateurs
                if (userRole === "super_admin") {
                  return true;
                }
                // Si l'utilisateur connecté est admin, il ne voit que les utilisateurs de sa/ses compagnie(s)
                // SAUF les super_admin
                if (userRole === "admin") {
                  // Exclure les super_admin
                  if (user.role === "super_admin") {
                    return false;
                  }
                  // Vérifier si l'utilisateur appartient à une des compagnies de l'admin connecté
                  return user.company.some((item) =>
                    userCompany.some((uc) => uc.idCompany === item.idCompany),
                  );
                }
                // Pour les autres rôles (user), logique par défaut
                return user.company.some((item) =>
                  userCompany.some((uc) => uc.idCompany === item.idCompany),
                );
              })
              ?.map((user: UserType) => {
                const companyLength = user.company?.length;
                const shopLength = shops?.length;
                const companylist =
                  companyLength === shopLength || user.role === "super_admin"
                    ? "Toutes les enseignes"
                    : user.company.map((item) => item.nameCompany).join(", ");
                const storelist =
                  user.stores &&
                  user.stores.map((item) => item.name).join(", ");

                // if(user.role !== 'super_admin'){
                //   return
                // }

                return (
                  <tr key={user.id}>
                    <td>{companylist}</td>
                    <td>{storelist}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="transparent"
                          id="dropdown-basic"
                          className="border-0 no-chevron"
                        >
                          <b>
                            <FaEllipsisVertical />
                          </b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item
                            onClick={() => {
                              handleShowEdit(user);
                            }}
                          >
                            <FaPencil /> Modifier
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedUserId(user.id);
                              handleShowDelete();
                            }}
                          >
                            <FaTrash /> Supprimer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
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
      </Container>
      <Button
        variant="primary"
        className="rounded-pill fab"
        onClick={handleShowAdd}
      >
        <strong>+</strong> <span>Ajouter un utilisateur</span>
      </Button>
      <ModalAddUser
        showAdd={showAdd}
        handleCloseAdd={handleCloseAdd}
        userDataToEdit={selectedUser}
        // setAllUsers={setAllUsers}
      />
      <ModalGenericDelete modalGenericDeleteProps={modalGenericDeleteProps} />
    </Container>
  );
}
