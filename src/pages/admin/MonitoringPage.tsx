import { _buildPaginationItems } from "@/components/ui/pagination";
import logServiceInstance from "@/services/LogService";
import { LogResultType } from "@/types/logType";
import { _formattedDate, _statusBadge } from "@/utils/functions";
import React from "react";
import {
  Badge,
  Container,
  Form,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaX } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "rsuite";

export default function MonitoringPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [logs, setLogs] = React.useState<LogResultType>({} as LogResultType);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<string>(params.get("page") || "1");
  const [perPage, setPerPage] = React.useState<string>(
    params.get("perPage") || "10",
  );
  const [route, setRoute] = React.useState<string>(params.get("route") || "");
  const [level, setLevel] = React.useState<string>(params.get("level") || "");
  const [user, setUser] = React.useState<string>(params.get("user") || "");
  const [message, setMessage] = React.useState<string>(
    params.get("message") || "",
  );
  const [createdAt, setCreatedAt] = React.useState<string>(
    params.get("createdAt") || "",
  );
  const [debouncedFilters, setDebouncedFilters] = React.useState({
    page,
    perPage,
    route,
    level,
    user,
    message,
    createdAt,
  });

  const isFiltering =
    route === "" &&
    level === "" &&
    user === "" &&
    message === "" &&
    createdAt === "";

  const totalPages = Math.ceil(logs?.total / parseInt(perPage));
  const currentPage = parseInt(page);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters({
        page,
        perPage,
        route,
        level,
        user,
        message,
        createdAt,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [page, perPage, route, level, user, message, createdAt, currentPage]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.page) params.set("page", debouncedFilters.page);
    if (debouncedFilters.perPage)
      params.set("perPage", debouncedFilters.perPage);
    if (debouncedFilters.route) params.set("route", debouncedFilters.route);
    if (debouncedFilters.level) params.set("level", debouncedFilters.level);
    if (debouncedFilters.user) params.set("user", debouncedFilters.user);
    if (debouncedFilters.message)
      params.set("message", debouncedFilters.message);
    if (debouncedFilters.createdAt)
      params.set("createdAt", debouncedFilters.createdAt);

    getPaginatedLogs(
      debouncedFilters.page,
      debouncedFilters.perPage,
      debouncedFilters.route,
      debouncedFilters.level,
      debouncedFilters.user,
      debouncedFilters.message,
      debouncedFilters.createdAt,
    );

    navigate(`/tableau-de-bord/logs?${params.toString()}`);
  }, [debouncedFilters, navigate]);

  const getPaginatedLogs = async (
    page: string,
    perPage: string,
    route: string,
    level: string,
    user: string,
    message: string,
    createdAt: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await logServiceInstance.getPaginatedLogs(
        page,
        perPage,
        route,
        level,
        user,
        message,
        createdAt,
      );
      setLogs(response);
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
    setRoute("");
    setLevel("");
    setUser("");
    setMessage("");
    setCreatedAt("");
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
      <h3 className="py-3">Gestion des Logs</h3>
      <Container>
        <Table striped hover responsive="sm" className="shadow">
          <thead className="sticky-sm-top ">
            <tr className="text-start">
              <th className="py-3">Id</th>
              <th className="py-3">Utilisateur</th>
              <th className="py-3">Gravité</th>
              <th className="py-3">Route</th>
              <th className="py-3">Message</th>
              <th className="py-3">Date</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th className="py-3"></th>
              <th className="py-3">
                <Form.Group controlId="user">
                  <Form.Control
                    type="text"
                    placeholder="Utilisateur"
                    value={user}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUser(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="level">
                  <Form.Control
                    type="text"
                    placeholder="Gravité"
                    value={level}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setLevel(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="route">
                  <Form.Control
                    type="text"
                    placeholder="Route"
                    value={route}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRoute(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
                <Form.Group controlId="message">
                  <Form.Control
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setMessage(e.target.value);
                      setPage("1");
                    }}
                  />
                </Form.Group>
              </th>
              <th className="py-3">
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
              </th>
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
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <Spinner size="sm" /> Chargement...
                </td>
              </tr>
            ) : (
              logs?.logs?.map((log, indx: number) => {
                const userName = log?.user?.split("@")[0];
                return (
                  <tr key={indx}>
                    <td>{log.id}</td>
                    <td>{userName}</td>
                    <td>
                      <Badge bg={_statusBadge(log.level)}>{log.level}</Badge>
                    </td>
                    <td>{log.route}</td>
                    <td className="text-start">{log.message}</td>
                    <td colSpan={1} className="text-start">
                      <small>{_formattedDate(log.timestamp)}</small>
                    </td>
                    <td></td>
                  </tr>
                );
              })
            )}
            {!isLoading && logs?.logs?.length === 0 && (
              <tr>
                <td colSpan={7}>Aucune donnée chargée</td>
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
