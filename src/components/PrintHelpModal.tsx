import React from 'react'
import { Modal, Button, Row, Col, Card, ListGroup } from 'react-bootstrap'

interface PrintHelpModalProps {
  show: boolean
  onHide: () => void
}

const PrintHelpModal: React.FC<PrintHelpModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" >
      <Modal.Header className='border border-3 border-info  border-bottom-0' closeButton>
        <Modal.Title>Guide d'utilisation - Options d'impression</Modal.Title>
      </Modal.Header>
      <Modal.Body className='border border-3 border-info border-top-0 border-bottom-0'>
        <Row>
          <Col md={12}>
            <h5>🎯 Modes d'impression disponibles</h5>
            <p>Notre système d'impression avancé vous offre trois modes principaux :</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="text-primary">📄 Impression simple</Card.Title>
                <Card.Text>
                  Génère un PDF avec une seule copie de votre affiche aux dimensions exactes.
                  Idéal pour l'impression directe ou l'archivage.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="text-success">🔄 Duplication sur une page</Card.Title>
                <Card.Text>
                  Place automatiquement plusieurs copies de votre affiche sur une même page
                  (A4, A3 ou format personnalisé) pour optimiser l'utilisation du papier.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="text-info">🔗 Combinaison de PDFs</Card.Title>
                <Card.Text>
                  Combine votre affiche actuelle avec d'autres PDFs sur une même page,
                  en conservant les dimensions d'origine de chaque document.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <h5>📏 Formats de page supportés</h5>
            <ListGroup horizontal className="mb-3">
              <ListGroup.Item>A4 (210 × 297 mm)</ListGroup.Item>
              <ListGroup.Item>A3 (297 × 420 mm)</ListGroup.Item>
              <ListGroup.Item>A5 (148 × 210 mm)</ListGroup.Item>
              <ListGroup.Item>A2 (420 × 594 mm)</ListGroup.Item>
              {/* <ListGroup.Item>Personnalisé</ListGroup.Item> */}
            </ListGroup>
          </Col>
        </Row>

        {/* <Row className="mb-4">
          <Col md={12}>
            <h5>⚙️ Fonctionnalités avancées</h5>
            <Row>
              <Col md={6}>
                <h6>Calcul automatique du layout</h6>
                <ul>
                  <li>Détermine automatiquement le nombre optimal de copies par page</li>
                  <li>Calcule l'espacement entre les copies</li>
                  <li>Optimise l'utilisation de l'espace disponible</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Gestion des dimensions</h6>
                <ul>
                  <li>Conserve les proportions originales</li>
                  <li>Adapte automatiquement à la taille de page</li>
                  <li>Prévient la déformation des images</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <h5>💡 Exemples d'utilisation</h5>
            <Card className="bg-light">
              <Card.Body>
                <h6>Exemple 1 : Affiche 200×40 mm sur A4</h6>
                <p className="mb-2">
                  <strong>Résultat :</strong> 4 copies disposées en 2×2 avec espacement de 5mm
                </p>
                <small className="text-muted">
                  Calcul : (200×2 + 5) × (40×2 + 5) = 405×85 mm (rentre dans A4 : 210×297 mm)
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h5>🚀 Conseils d'utilisation</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Pour les petites affiches :</strong> Utilisez le mode duplication pour maximiser l'utilisation du papier
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Pour les affiches complexes :</strong> Testez d'abord avec l'impression simple
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Pour l'archivage :</strong> Le mode simple conserve la qualité maximale
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Pour la production :</strong> Le mode duplication réduit les coûts d'impression
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row> */}
      </Modal.Body>
      <Modal.Footer className='border border-3 border-info border-top-0'>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PrintHelpModal
