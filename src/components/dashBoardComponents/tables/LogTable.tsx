import TableLoader from "@/components/ui/squeleton/TableLoader";
import TableFilter, { FilterField } from "@/components/ui/table/TableFilter";
import TableHeader from "@/components/ui/table/TableHeader";
import { LogHookType } from "@/types/logType";
import { _formattedDate, _statusBadge } from "@/utils/functions";
import { Badge, Table } from "react-bootstrap";

export default function LogTable({ useLog }: { useLog: LogHookType }) {
  const resetForm = () => {
    useLog.setRoute("");
    useLog.setLevel("");
    useLog.setUser("");
    useLog.setMessage("");
    useLog.setCreatedAt("");
  };

  const fields: FilterField[] = [
    {
      type: "empty",
    },
    {
      type: "text",
      controlId: "user",
      placeholder: "Utilisateur",
      value: useLog.user,
      onChange: (v: string) => {
        useLog.setUser(v);
        useLog.setPage("1");
      },
    },
    {
      type: "text",
      controlId: "level",
      placeholder: "Gravité",
      value: useLog.level,
      onChange: (v: string) => {
        useLog.setLevel(v);
        useLog.setPage("1");
      },
    },
    {
      type: "text",
      controlId: "route",
      placeholder: "Route",
      value: useLog.route,
      onChange: (v: string) => {
        useLog.setRoute(v);
        useLog.setPage("1");
      },
    },
    {
      type: "text",
      controlId: "message",
      placeholder: "Message",
      value: useLog.message,
      onChange: (v: string) => {
        useLog.setMessage(v);
        useLog.setPage("1");
      },
    },
    {
      type: "date",
      controlId: "createdAt",
      placeholder: "Date",
      value: useLog.createdAt,
      onChange: (v: string) => {
        useLog.setCreatedAt(v);
        useLog.setPage("1");
      },
    },
  ];

  return (
    <Table striped hover responsive="sm" className="shadow">
      <TableHeader columnsData={useLog.columnsData} />
      <TableFilter
        fields={fields}
        resetForm={resetForm}
        isFiltering={useLog.isFiltering}
      />
      <tbody>
        {useLog.isLoading ? (
          <TableLoader lengthTr={5} lengthTd={7} />
        ) : (
          useLog.logs?.logs?.map((log) => {
            const userName = log?.user?.split("@")[0];
            return (
              <tr key={log.id}>
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
        {!useLog.isLoading && useLog.logs?.logs?.length === 0 && (
          <tr>
            <td colSpan={7}>Aucune donnée chargée</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
