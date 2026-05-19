import { Form, Button } from "react-bootstrap";
import { FaX } from "react-icons/fa6";

type BaseFilterField = {
  controlId: string;
  value: string;
  onChange: (value: string) => void;
  emptyCell?: boolean; // pour les colonnes sans filtre (ex: logs)
};

type TextFilterField = BaseFilterField & {
  type: "text" | "date";
  placeholder: string;
};

type SelectFilterField = BaseFilterField & {
  type: "select";
  placeholder: string;
  options: { id: number | string; name: string }[];
};

type EmptyCellField = {
  type: "empty";
};

export type FilterField = TextFilterField | SelectFilterField | EmptyCellField;

interface TableFiltersProps {
  fields: FilterField[];
  resetForm: () => void;
  isFiltering: boolean;
}

export default function TableFilters({ fields, resetForm, isFiltering }: TableFiltersProps) {
  return (
    <thead>
      <tr>
        {fields.map((field, index) => {
          if (field.type === "empty") {
            return <th key={index} className="py-3" />;
          }

          if (field.type === "select") {
            return (
              <th key={field.controlId} className="py-3">
                <Form.Group controlId={field.controlId}>
                  <Form.Select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </th>
            );
          }

          return (
            <th key={field.controlId} className="py-3">
              <Form.Group controlId={field.controlId}>
                <Form.Control
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </Form.Group>
            </th>
          );
        })}

        <th className="py-3" style={{ width: "150px" }}>
          <Button onClick={resetForm} disabled={isFiltering}>
            <div className="flex items-center">
              <FaX size={10} className="me-1" />
              <small>Réinitialiser</small>
            </div>
          </Button>
        </th>
      </tr>
    </thead>
  );
}
