import logServiceInstance from "@/services/LogService"
import { _formattedDate, _statusBadge } from "@/utils/functions";
import React from "react"
import { Badge, Container, Spinner, Table } from "react-bootstrap";


export default function MonitoringPage() {

    const [logs, setLogs]= React.useState<any[]>([]);
    const [isLoading, setIsLoading]= React.useState<boolean>(false);
    
    React.useEffect(() => {
        getAllLogs()
    }, [])

    const getAllLogs = async () => {
      setIsLoading(true)
        try{
           const response = await logServiceInstance.getLogs()
           setLogs(response.data.logs)
        }catch(error){
            console.log(error)
        }finally{
          setIsLoading(false)
        }
    }

    return (
      <Container fluid className="p-0">
        <h3 className="py-3">Gestion des Logs</h3>
        <Container>
          <Table striped hover responsive="sm" className="shadow">
            <thead className="sticky-sm-top ">
              <tr>
                <th className="py-3">Id</th>
                <th className="py-3">utilisateur</th>
                <th className="py-3">Gravité</th>
                <th className="py-3">route</th>
                <th className="py-3">Message</th>
                <th className="py-3">date</th>
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
                logs.map((log: any, indx: number) => {
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
                      <td>
                        <small>{_formattedDate(log.timestamp)}</small>
                      </td>
                    </tr>
                  );
                })
              )}
              {!isLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    Aucune donnée chargée
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </Container>
    );

}