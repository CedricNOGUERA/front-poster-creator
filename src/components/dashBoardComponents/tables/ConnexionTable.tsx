import TableLoader from "@/components/ui/squeleton/TableLoader";
import ResetFormButton from "@/components/ui/table/ResetFormButton";
import { ConnexionStatType, ConnexionType } from "@/types/ConnextionStatType";
import { ShopType } from "@/types/ShopType";
import { createResetForm } from "@/utils/admin/function";
import moment from "moment";
import { Form, Table } from "react-bootstrap";

interface ConnexionTableType {
  connectedAt: string;
  setConnectedAt: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  shops: ShopType[];
  connexions: ConnexionStatType;
  isFiltering: boolean;
  isLoading: boolean;
}

export default function ConnexionTable({
  connexionTableProps,
}: {
  connexionTableProps: ConnexionTableType;
}) {
  const {
    connectedAt,
    setConnectedAt,
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    setPage,
    shops,
    connexions,
    isFiltering,
    isLoading,
  } = connexionTableProps;

  const resetForm = createResetForm({
    setName,
    setEmail,
    setCompany,
    setConnectedAt,
  });
  
  return (
    <Table striped hover responsive="sm" className="shadow">
      <thead>
        <tr>
          {/* <th></th> */}
          <th>Date</th>
          <th>Nom</th>
          <th>email</th>
          <th>Compagnie</th>
          <th></th>
        </tr>
      </thead>
      <thead>
        <tr>
          {/* <th className="py-3">
                <Form.Group>
                  <Form.Check />
                </Form.Group>
              </th> */}
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
          </th>
          <th className="py-3">
            <ResetFormButton resetForm={resetForm} isFiltering={isFiltering} />
          </th>
        </tr>
      </thead>
      <tbody>
        {connexions?.connexions?.map((conn: ConnexionType, index: number) => (
          <tr key={index}>
            {/* <td>
                    <Form.Group>
                      <Form.Check />
                    </Form.Group>
                  </td> */}
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
        ))}
        {connexions?.connexions?.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center">
              Aucune connexion trouvée.
            </td>
          </tr>
        )}
        {isLoading && <TableLoader lengthTr={5} lengthTd={5} />}
      </tbody>
    </Table>
  );
}
