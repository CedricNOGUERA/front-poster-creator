import React from "react";
import StatServices from "@/services/StatServices";
import { ConnexionStatType, ConnexionType } from "@/types/ConnextionStatType";
import { Container, Spinner, Table } from "react-bootstrap";
import moment from "moment";

export default function ConnexionCount() {
  const [connexions, setconnexions] = React.useState<ConnexionStatType>(
    {} as ConnexionStatType,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    getAllConnexions();
  }, []);

  const getAllConnexions = async () => {
    setIsLoading(true);
    try {
      const data = await StatServices.getConnexionCount();
      setconnexions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
      </Container>
    </Container>
  );
}
