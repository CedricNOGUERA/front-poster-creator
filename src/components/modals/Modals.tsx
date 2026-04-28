import { FeedBackSatateType } from "@/types/DiversType";
import { _handleFileChange } from "@/utils/functions";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";

interface AddShopModalType {
  showAdd: boolean;
  handleCloseAdd: () => void;
  formData: {
    name: string;
    image: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      image: string;
    }>
  >;
  validateField: (fieldName: string, value: string) => void;
  fieldErrors: { [key: string]: string };
  feedBackState: FeedBackSatateType;
  validated: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddShopModal({
  addShopModalProps,
}: {
  addShopModalProps: AddShopModalType;
}) {
  const {
    showAdd,
    handleCloseAdd,
    formData,
    setFormData,
    validateField,
    fieldErrors,
    feedBackState,
    validated,
    setFile,
    handleSubmit,
  } = addShopModalProps;

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlusCircle className="fs-1" /> &nbsp;Ajouter un nouveau magasin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Saissisez le nom du magasin"
              value={formData.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
                validateField("name", e.target.value);
              }}
              onBlur={(e) => validateField("name", e.target.value)}
              required
              isInvalid={
                (validated && !formData.name.trim()) || !!fieldErrors.name
              }
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name || "Veuillez saisir un nom de magasin."}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="">Ajouter une image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setFile)
              }
              required
              isInvalid={
                (validated && !formData.image.trim()) || !!fieldErrors.image
              }
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name || "Une image est requise."}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseAdd();
              setFile(null);
              setFormData({
                name: "",
                image: "",
              });
            }}
          >
            Annuler
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={feedBackState.isLoading}
          >
            {feedBackState.isLoading ? (
              <>
                <Spinner size="sm" /> {feedBackState.loadingMessage}
              </>
            ) : (
              <span>Ajouter</span>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
