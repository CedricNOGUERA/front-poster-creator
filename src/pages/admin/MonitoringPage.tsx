import LogTable from "@/components/dashBoardComponents/tables/LogTable";
import TablePagination from "@/components/ui/table/TablePagination";
import useLogPage from "@/hook/useLogPage";
import { Container } from "react-bootstrap";

export default function MonitoringPage() {

  const useLog = useLogPage();
  
  return (
    <Container fluid className="p-0">
      <h3 className="py-3">Gestion des Logs</h3>
      <Container>
        <LogTable useLog={useLog} />
        <TablePagination
          tablePaginationProps={{
            currentPage: useLog.currentPage,
            totalPages: useLog.totalPages,
            page: useLog.page,
            setPage: useLog.setPage,
            perPage: useLog.perPage,
            setPerPage: useLog.setPerPage,
          }}
        />
      </Container>
    </Container>
  );
}
