import { DimensionType } from "@/types/DimensionType";
import { Col, Form, Row } from "react-bootstrap";
import dimensions from "@/data/dimensions.json";
import { StoreType } from "@/stores/storeApp";
import { DragDropHookType } from "@/types/DragDropEditor";

export default function DimensionSelecter({
  useDrag,
  storeApp,
}: {
  useDrag: DragDropHookType;
  storeApp: StoreType;
}) {
  return (
    <Row className="text-start">
      <Col xs={12}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Select
            value={useDrag.selectedDimension || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const dimensionId = parseInt(e.target.value);
              useDrag.setSelectedDimension(dimensionId);
              storeApp.setDimensionId(dimensionId);
              const selectedDim = dimensions.find((d) => d.id === dimensionId);
              if (selectedDim) {
                useDrag.setNewTemplateState((prev) => ({
                  ...prev,
                  width: selectedDim.width,
                  height: selectedDim.height,
                }));
              }
            }}
          >
            <option value="">Sélection une dimension</option>
            {dimensions.map((dimension: DimensionType, index: number) => (
              <option key={index} value={dimension.id}>
                {dimension.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
}
