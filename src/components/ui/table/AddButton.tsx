import { Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

export default function AddButton({
  handleShowAdd,
  title,
}: {
  handleShowAdd: () => void;
  title: string;
}) {
  return (
    <Button
      variant="primary"
      className="rounded d-flex align-items-center gap-1"
      onClick={handleShowAdd}
    >
      <FaPlusCircle /> <span>{title}</span>
    </Button>
  );
}
