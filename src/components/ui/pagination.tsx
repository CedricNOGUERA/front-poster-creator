import { Pagination } from "react-bootstrap";

type PaginationBuilderProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

export const _buildPaginationItems = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 3,
}: PaginationBuilderProps) => {
  const items: React.ReactNode[] = [];

  const startPage = Math.max(1, currentPage - maxVisiblePages);
  const endPage = Math.min(totalPages, currentPage + maxVisiblePages);

  if (startPage > 1) {
    items.push(
      <Pagination.Item key={1} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>,
    );

    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }
  }

  for (let number = startPage; number <= endPage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }

    items.push(
      <Pagination.Item
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>,
    );
  }

  return items;
};