import StatServices from "@/services/StatServices"
import moment from "moment";
import React from "react";
import { Container, Table } from "react-bootstrap";

export default function ConnexionCount() {

    const [connexions, setconnexions] = React.useState<any>([]);

    React.useEffect( () => {
        getAllConnexions();
    }, [])

    const getAllConnexions = async() => {
        const data = await StatServices.getConnexionCount()
        setconnexions(data)
    }

    return (
      <Container fluid className="p-0">
        <h3 className="py-3 mb-0">Gestion des Connexions</h3>
        <Container>
          <Table striped hover responsive='sm' className='shadow'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>email</th>
                <th>Copmagnie</th>
              </tr>
            </thead>
            <tbody>
              {connexions?.connexions?.map((conn: any, index: number) => (
                <tr key={index}>
                  <td>
                    {moment(conn.dateOfConnexion).add(10, "days").calendar()} à{" "}
                    {moment(conn.dateOfConnexion).format("h:mm:ss")}
                  </td>
                  <td>{conn.name}</td>
                  <td>{conn.email}</td>
                  <td>{conn.company.nameCompany}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    );
}