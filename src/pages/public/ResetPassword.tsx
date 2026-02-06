import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Vérifier le token au chargement
    const verifyToken = async () => {
      const response = await fetch(
        `${API_URL}/api/verify-reset-token?token=${token}&email=${email}`
      );
      const data = await response.json();
      setTokenValid(data.valid);
      if (!data.valid) {
        setError(data.error || 'Token invalide');
      }
    };

    if (token && email) {
      verifyToken();
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Mot de passe réinitialisé avec succès !');
        navigate('/login');
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-5">
      <h2>Réinitialiser le mot de passe</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nouveau mot de passe</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Confirmer le mot de passe</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Réinitialisation...' : 'Réinitialiser'}
        </Button>
      </Form>
    </div>
  );
};