import authServiceInstance from "@/services/AuthService";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { _getMe } from "@/utils/apiFunctions";
import { AxiosError } from "axios";
import React from "react";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import { FaCircleExclamation } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import DynamicIcon from "../ui/DynamicIcon";
import logo from '@/assets/images/poster_app_logo.svg'

const LoginForm = () => {
  /* States
   *******************************************************************************************/
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const authLogin = userDataStore((state: UserDataType) => state.authLogin);

  // const [show, setShow] = React.useState<boolean>(false);

  // const [forgotEmail, setForgotEmail] = React.useState<string>('');
  //   const [message, setMessage] = React.useState<string>('');
  //   const [forgotError, setForgotError] = React.useState<string>('');
  //   const [forgotLoading, setForgotLoading] = React.useState<boolean>(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  /* Functions
   *******************************************************************************************/
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authServiceInstance.loginUser({ email, password });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        _getMe(authLogin);
        navigate("/editeur-de-bon-plan");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        if (err.response?.data.message) {
          setError(err.response?.data.message);
        } else if (err.response?.data.error) {
          setError(err.response?.data.error);
        } else if (err.code === "ERR_NETWORK") {
          setError(
            "Une erreur de connexion au serveur est survenue, vérifiez votre connexion internet. Si le problème persiste, contactez l'assistance."
          );
        } else {
          setError("Une erreur inattendue est survenue");
        }
      } else {
        setError("Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };
  console.log("API =", import.meta.env.VITE_API_URL);

  /* Render
   *******************************************************************************************/
  return (
    <Card className="p-4  border-2 shadow">
      <img src={logo} alt="Logo" className="mb-3 d-block mx-auto" width={90} />
      <h3 className="text-center text-muted mb-0">Générateur</h3>
      {/* <h2 className="text-center text-muted mb-4">d'affiche</h2> */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label></Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="formBasicPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputGroup.Text
              id="eyeOrNot"
              className="bg-transparent border border-start-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {" "}
              <DynamicIcon
                iconKey={
                  !showPassword ? "fa-regular eye-slash" : "fa-regular eye"
                }
                size={20}
                className="text-secondary"
              />
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        {/* <div className="text-end text-primary pointer">
          <u onClick={handleShow}>Mot de passe oublié</u>
        </div> */}
        {error && (
          <Alert variant="danger" className="text-danger">
            <FaCircleExclamation className="me-2" />
            {error}
          </Alert>
        )}
        <div className="mt-3 text-center">
          <Button
            variant="primary"
            type="submit"
            className="w-100 m-auto"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Connectez-vous"}
          </Button>
        </div>
      </Form>
      {/* <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mot de passe oublié</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-5">
            {forgotError && <Alert variant="danger">{forgotError}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleForgotSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={forgotLoading}>
            {forgotLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </Card>
  );
};

export default LoginForm;
