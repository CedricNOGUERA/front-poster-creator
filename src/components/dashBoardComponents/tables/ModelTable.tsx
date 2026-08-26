import TableLoader from "@/components/ui/squeleton/TableLoader";
import { Button, Dropdown, Form, Image, Table } from "react-bootstrap";
import { FaCheck, FaEllipsisVertical, FaTrash, FaX } from "react-icons/fa6";
import { ModelHookType } from "@/types/modelType";
import { createResetForm } from "@/utils/admin/function";
import { FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function ModelTable({ useModel }: { useModel: ModelHookType }) {
  const resetForm = createResetForm({
    setId: useModel.setId,
    setTemplate: useModel.setTemplate,
    setDimension: useModel.setDimension,
    setStatus: useModel.setStatus
  });
  return (
    <Table striped hover responsive="sm" className="shadow">
      <thead className="sticky-sm-top text-start">
        <tr>
          <th className="py-3">Id</th>
          <th className="py-3">Template</th>
          <th className="py-3">Dimension</th>
          <th className="py-3">Etat</th>
          <th className="py-3">Miniature</th>
          <th className="py-3">Actions</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th className="py-3">
            <Form.Group controlId="id">
              <Form.Control
                type="text"
                placeholder="id.."
                value={useModel.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  useModel.setId(e.target.value);
                  useModel.setPage("1");
                }}
              />
            </Form.Group>
          </th>
          <th className="py-3">
            <Form.Group controlId="template">
              <Form.Select
                aria-label="template"
                value={useModel.template}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  useModel.setTemplate(e.target.value);
                  useModel.setPage("1");
                }}
              >
                <option value="">template...</option>
                {useModel.templates?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </th>
          <th className="py-3">
            <Form.Group controlId="dimension">
              <Form.Select
                aria-label="dimension"
                value={useModel.dimension}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  useModel.setDimension(e.target.value);
                  useModel.setPage("1");
                }}
              >
                <option value="">dimension...</option>
                {useModel.dimensions?.map((dimension) => (
                  <option key={dimension.id} value={dimension.id}>
                    {dimension.dimension}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </th>
          <th className="py-3">
            <Form.Group controlId="status">
              <Form.Select
                aria-label="status"
                value={useModel.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  useModel.setStatus(e.target.value);
                  useModel.setPage("1");
                }}
              >
                <option value="">état...</option>
                {[{name:"Activer", value: "true"}, {name:"Désactiver", value: "false"}]?.map((status) => (
                  <option key={status.name} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </th>

          <th className="py-3"></th>

          <th className="py-3">
            <Button onClick={() => resetForm()} disabled={useModel.isFiltering}>
              <div className="flex items-center">
                <FaX size={10} className="me-1" />
                <small>Réinitialiser</small>
              </div>
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {useModel.paginatedModels?.models?.map((model, indx) => {
          const templateData =
            useModel.templates &&
            useModel.templates.find(
              (temp) =>
                temp.categoryId === model.categoryId &&
                temp.id === model.templateId,
            );
          const modelImage = useModel.imageModels.find(
            (img) =>
              img.modelId === model.id && img.categoryId === model.categoryId,
          );
          const dimension = useModel.dimensions.find(
            (dim) => dim.id === model.dimensionId,
          );
          const factor = dimension && 120 / dimension?.width;
          const baseSlug = `${API_URL}/uploads/modelMiniature/`;


          return (
            <tr key={indx} className="align-middle">
              <td>{model.id}</td>
              <td>{templateData?.name}</td>
              <td>{dimension?.dimension}</td>
              <td>
                {model.activated ? (
                  <FaCheck className="me-2" size={20} color="#38c42b" />
                ) : (
                  <FaTimes className="me-2" size={20} color="#ff002b" />
                )}
              </td>
              <td>
                <Image
                  loading="lazy"
                  src={`${baseSlug}${model.id}/${modelImage?.name}`}
                  alt={`Miniature du model #${model.id}`}
                  width={dimension && factor && dimension?.width * factor}
                  height={dimension && factor && dimension?.height * factor}
                />
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="transparent"
                    id={`dropdown-model-${model.id}`}
                    className="border-0 no-chevron"
                  >
                    <b>
                      <FaEllipsisVertical />
                    </b>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    {model.activated ? (
                      <Dropdown.Item
                        onClick={() => useModel.handleShowActivatedModal(model)}
                        className="d-flex align-items-center text-warning"
                      >
                        <FaTimes className="me-2" size={16} />
                        Désactiver
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        onClick={() => useModel.handleShowActivatedModal(model)}
                        className="d-flex align-items-center text-success"
                      >
                        <FaCheck className="me-2" size={16} />
                        Activer
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      onClick={() => useModel.handleShowDeleteModal(model)}
                      className="d-flex align-items-center text-danger"
                    >
                      <FaTrash className="me-2" size={16} />
                      Supprimer
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          );
        })}
        {useModel.isLoadingDisplay && <TableLoader lengthTr={5} lengthTd={5} />}
        {useModel.paginatedModels?.models?.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center">
              Aucune connexion trouvée.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
