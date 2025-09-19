import authServiceInstance from "@/services/AuthService";
import userDataStore, { UserDataType } from "@/stores/userDataStore";
import { _getMe } from "@/utils/apiFunctions";
import { AxiosError } from "axios";
import React from "react";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

  /* Functions
   *******************************************************************************************/
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authServiceInstance.loginUser({ email, password });

      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.token);
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

  /* Render
   *******************************************************************************************/
  return (
    <Card className="p-4  border-2 shadow">
      <h3 className="text-center text-muted mb-4">Connexion</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label></Form.Label>
          <Form.Control
            type="email"
            placeholder="Saisissez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="formBasicPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Saisissez votre mot de passe"
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
              <i
                className={`fa-regular fa-${
                  !showPassword ? "eye-slash" : "eye"
                } text-secondary`}
              ></i>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        {error && (
          <Alert variant="danger" className="text-danger">
            <i className="fa-solid fa-circle-exclamation me-2 "></i>
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
    </Card>
  );
};

export default LoginForm;
