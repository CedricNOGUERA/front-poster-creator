import React from "react";
import { Container } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { ShopType } from "@/types/ShopType";
import { ToastDataType } from "@/types/DiversType";
import TablePagination from "@/components/ui/table/TablePagination";
import { useConnexionCount } from "@/hook/useConnextionCount";
import ConnexionTable from "@/components/dashBoardComponents/tables/ConnexionTable";

interface ContextConnexionType {
  shops: ShopType[];
  toggleShow: () => void;
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>;
}

export default function ConnexionCount() {
  const { shops } = useOutletContext<ContextConnexionType>();
  const connex = useConnexionCount();

  return (
    <Container fluid className="p-0">
      <h3 className="py-3 mb-0">Gestion des Connexions</h3>
      <Container>
        <ConnexionTable connexionTableProps={{ ...connex, shops }} />
        <TablePagination
          tablePaginationProps={{
            currentPage: connex.currentPage,
            totalPages: connex.totalPages,
            page: connex.page,
            setPage: connex.setPage,
            perPage: connex.perPage,
            setPerPage: connex.setPerPage,
          }}
        />
      </Container>
    </Container>
  );
}
