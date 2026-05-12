import React from "react";
import StatServices from "@/services/StatServices";
import { ConnexionStatType, ConnexionType } from "@/types/ConnextionStatType";
import {
  Button,
  Container,
  Form,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import moment from "moment";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { _buildPaginationItems } from "@/components/ui/pagination";
import { FaX } from "react-icons/fa6";
import { ShopType } from "@/types/ShopType";
import { ToastDataType } from "@/types/DiversType";

interface ContextConnexionType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export default function ConnexionCount() {
  const { shops } =
    useOutletContext<ContextConnexionType>();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [connexions, setConnexions] = React.useState<ConnexionStatType>(
    {} as ConnexionStatType,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "20",
  );
  const [name, setName] = React.useState<string>(params.get("name") || "");
  const [email, setEmail] = React.useState<string>(params.get("email") || "");
  const [company, setCompany] = React.useState<string>(
    params.get("company") || "",
  );
  const [connectedAt, setConnectedAt] = React.useState<string>(
    params.get("connectedAt") || "",
  );

  const [debouncedFilters, setDebouncedFilters] = React.useState({
    page,
    perPage,
    name,
    email,
    company,
    connectedAt,
  });

  const isFiltering =
    name === "" && email === "" && company === "" && connectedAt === "";

  const totalPages = Math.ceil(connexions?.total / parseInt(perPage));
  const currentPage = parseInt(page);


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters({
        page,
        perPage,
        name,
        email,
        company,
        connectedAt,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, name, email, company, connectedAt, currentPage]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.name) params.set("name", debouncedFilters.name);
    if (debouncedFilters.email) params.set("email", debouncedFilters.email);
    if (debouncedFilters.company)
      params.set("company", debouncedFilters.company);
    if (debouncedFilters.connectedAt)
      params.set("connectedAt", debouncedFilters.connectedAt);

    getPaginatedConnexions(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.name,
      debouncedFilters.email,
      debouncedFilters.company,
      debouncedFilters.connectedAt,
    );

    navigate(`/tableau-de-bord/connexions?${params.toString()}`);
  }, [debouncedFilters, navigate]);

  const getPaginatedConnexions = async (
    page: string,
    perPage: string,
    name: string,
    email: string,
    company: string,
    connectedAt: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await StatServices.paginatedConnexion(
        page,
        perPage,
        name,
        email,
        company,
        connectedAt,
      );
      setConnexions(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des logs paginés:", error);
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
    setName("");
    setEmail("");
    setCompany("");
    setConnectedAt("");
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

  return (
    <Container fluid className="p-0">
      <h3 className="py-3 mb-0">Gestion des Connexions</h3>
      <Container>
        <Table striped hover responsive="sm" className="shadow">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>email</th>
              <th>Compagnie</th>
              <th></th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th className="py-3">
                <Form.Group controlId="connectedAt">
                  <Form.Control
                    type="date"
                    placeholder="Date de connection"
                    value={connectedAt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setConnectedAt(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="name">
                  <Form.Control
                    type="text"
                    placeholder="nom"
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
                    placeholder="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
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
                {/* <Form.Group controlId="company">
                  <Form.Control
                    type="text"
                    placeholder="magasin"
                    value={company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCompany(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group> */}
              </th>

              {/* <th className="py-3">
                <Form.Group controlId="createdAt">
                  <Form.Control
                    type="date"
                    placeholder="Date"
                    value={createdAt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCreatedAt(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th> */}
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
            {connexions?.connexions?.map(
              (conn: ConnexionType, index: number) => (
                <tr key={index}>
                  <td>
                    {moment
                      .utc(conn.dateOfConnexion)
                      .local()
                      .format("DD/MM/YYYY à HH:mm")}
                  </td>
                  <td>{conn.name}</td>
                  <td>{conn.email}</td>
                  <td>{conn.company?.nameCompany}</td>
                  <td></td>
                </tr>
              ),
            )}
            {connexions?.connexions?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  Aucune connexion trouvée.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={4}>
                  <Spinner
                    variant="primary"
                    size="sm"
                    animation="border"
                    role="status"
                  />
                  <span className="ms-2">Loading...</span>
                </td>
              </tr>
            )}
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
    </Container>
  );
}
