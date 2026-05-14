import { Button } from "react-bootstrap";
import { FaX } from "react-icons/fa6";

export default function ResetFormButton({resetForm, isFiltering}: {resetForm: () => void, isFiltering: boolean}) {
  return (
    <Button onClick={() => resetForm()} disabled={isFiltering}>
      <div className="flex items-center">
        <FaX size={10} className="me-1" />
        <small>Réinitialiser</small>
      </div>
    </Button>
  );
}
