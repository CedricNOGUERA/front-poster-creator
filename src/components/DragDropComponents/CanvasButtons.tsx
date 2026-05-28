import { DragDropHookType } from "@/types/DragDropEditor";
import { _handleExportToPDF } from "@/utils/functions";
import { Button } from "react-bootstrap";

export default function CanvasButtons({useDrag}: {useDrag: DragDropHookType}) {
  return (
    <div className="p-4 flex gap-2">
      <Button
        variant="primary"
        onClick={() => _handleExportToPDF(useDrag.newTemplateState)}
        className="me-4"
      >
        Exporter en PDF
      </Button>
      <Button
        variant="success"
        onClick={() => {
          useDrag.handleShowValidateModel();
        }}
        className=""
      >
        Enregistrer
      </Button>
    </div>
  );
}
