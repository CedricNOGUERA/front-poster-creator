import { Form, Pagination } from "react-bootstrap";
import { _buildPaginationItems } from "../pagination";

interface TablePaginationType {
  currentPage: number;
  totalPages: number;
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  perPage: string;
  setPerPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function TablePagination({
  tablePaginationProps,
}: {
  tablePaginationProps: TablePaginationType;
}) {
  const { currentPage, totalPages, page, setPage, perPage, setPerPage } =
    tablePaginationProps;

  const items = _buildPaginationItems({
    currentPage,
    totalPages,
    onPageChange: (p) => setPage(`${p}`),
  });

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
  );
}
