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
            <p>Notre système d'impression vous offre trois modes principaux :</p>
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
                  (A4, A3) pour optimiser l'utilisation du papier.
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

        <Row>
          <Col md={12}>
            <h5>📏 Formats de page supportés</h5>
            <ListGroup horizontal className="mb-3">
              <ListGroup.Item>A4 (210 × 297 mm)</ListGroup.Item>
              <ListGroup.Item>A3 (297 × 420 mm)</ListGroup.Item>

            </ListGroup>
          </Col>
        </Row>
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
