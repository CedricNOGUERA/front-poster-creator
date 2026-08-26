import { DimensionType } from "@/types/DimensionType";
import { Col, Form, Row } from "react-bootstrap";
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
        <Form.Group className="mb-3" controlId="posterDimension">
          <Form.Select
            value={useDrag.selectedDimension || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const dimensionId = parseInt(e.target.value);
              useDrag.setSelectedDimension(dimensionId);
              storeApp.setDimensionId(dimensionId);
              const selectedDim = useDrag.dimensions.find((d) => d.id === dimensionId);
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
            {useDrag.dimensions.map((dimension: DimensionType) => {
            if(!dimension.status){
              return null
            }
            return (
              <option key={dimension.id} value={dimension.id}>
                {dimension.name} - ({dimension.width}x{dimension.height})
              </option>
            )})}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
}
