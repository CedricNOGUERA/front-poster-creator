import TableLoader from "@/components/ui/squeleton/TableLoader";
import { ShopType } from "@/types/ShopType";
import { ResultUserType, UserType } from "@/types/UserType";
import { Dropdown, Form, Table } from "react-bootstrap";
import { FaEllipsisVertical, FaPencil, FaTrash } from "react-icons/fa6";
import storeData from "@/data/store.json";
import { createResetForm } from "@/utils/admin/function";
import ResetFormButton from "@/components/ui/table/ResetFormButton";

interface UserTableType {
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  shops: ShopType[];
  store: string;
  setStore: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  paginatedUsers: ResultUserType;
  userRole: "super_admin" | "admin" | "user";
  isFiltering: boolean;
  userCompany: {
    idCompany: number;
    nameCompany: string;
  }[];
  handleShowEdit: (user: UserType) => void;
  setSelectedUserId: React.Dispatch<React.SetStateAction<number | null>>;
  handleShowDelete: () => void;
  isLoading: boolean;
}

export function UserTable({
  userTableProps,
}: {
  userTableProps: UserTableType;
}) {
  const {
    company,
    setCompany,
    setPage,
    shops,
    store,
    setStore,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    paginatedUsers,
    userRole,
    isFiltering,
    userCompany,
    handleShowEdit,
    setSelectedUserId,
    handleShowDelete,
    isLoading,
  } = userTableProps;

  const resetForm = createResetForm({
    setCompany,
    setStore,
    setName,
    setEmail,
    setRole,
  });
  return (
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
          <th className="py-3" style={{ width: "150px" }}>
           <ResetFormButton resetForm={resetForm} isFiltering={isFiltering} />
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
              user.stores && user.stores.map((item) => item.name).join(", ");

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
        {paginatedUsers?.users?.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center">
              Aucune connexion trouvée.
            </td>
          </tr>
        )}
        {isLoading && <TableLoader lengthTr={5} lengthTd={6} />}
      </tbody>
    </Table>
  );
}
