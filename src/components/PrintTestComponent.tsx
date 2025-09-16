import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap'
import PrintOptionsModal from './PrintOptionsModal'
import { NewTemplateType } from '@/types/DiversType'

const PrintTestComponent: React.FC = () => {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [testMode, setTestMode] = useState<'single' | 'multiple' | 'combine'>('single')

  // Exemple d'affiche de test
  const testPoster: NewTemplateType = {
    width: 200,
    height: 40,
    idShop: 1,
    idCategory: 1
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <h2 className="mb-4">Test des options d'impression</h2>
          <Alert variant="info">
            <h5>🧪 Test de la fonctionnalité de combinaison de PDFs</h5>
            <p>Ce composant permet de tester la nouvelle fonctionnalité de combinaison de PDFs.</p>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Affiche de test (200×40 mm)</h5>
            </Card.Header>
            <Card.Body>
              <div
                ref={canvasRef}
                style={{
                  width: '200px',
                  height: '40px',
                  border: '2px solid #007bff',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#007bff'
                }}
              >
                AFFICHE TEST
              </div>
              <p className="text-muted text-center mt-2">
                Dimensions : 200 × 40 mm
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Instructions de test</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li>Cliquez sur "Tester les options d'impression"</li>
                <li>Sélectionnez le mode "Combinaison de PDFs"</li>
                <li>Uploadez un ou plusieurs fichiers PDF</li>
                <li>Attendez que les PDFs soient traités (aperçu visible)</li>
                <li>Cliquez sur "Générer PDF"</li>
                <li>Vérifiez que le PDF contient l'affiche + les PDFs uploadés</li>
              </ol>
              
              <Alert variant="warning" className="mt-3">
                <strong>Note :</strong> Les PDFs uploadés seront convertis en images et redimensionnés pour s'adapter à la page.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Mode de test</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Choisissez le mode à tester :</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="Impression simple"
                      name="testMode"
                      value="single"
                      checked={testMode === 'single'}
                      onChange={(e) => setTestMode(e.target.value as any)}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Duplication sur une page"
                      name="testMode"
                      value="multiple"
                      checked={testMode === 'multiple'}
                      onChange={(e) => setTestMode(e.target.value as any)}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Combinaison de PDFs"
                      name="testMode"
                      value="combine"
                      checked={testMode === 'combine'}
                      onChange={(e) => setTestMode(e.target.value as any)}
                      inline
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="primary"
                onClick={() => setShowPrintOptions(true)}
                className="w-100"
              >
                Tester les options d'impression
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <h5>🔍 Points de vérification</h5>
              <Row>
                <Col md={4}>
                  <h6>Mode Simple</h6>
                  <ul>
                    <li>PDF avec une seule copie</li>
                    <li>Dimensions exactes de l'affiche</li>
                    <li>Qualité d'image optimale</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Mode Duplication</h6>
                  <ul>
                    <li>Plusieurs copies sur une page</li>
                    <li>Layout optimisé automatiquement</li>
                    <li>Espacement correct entre copies</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Mode Combinaison</h6>
                  <ul>
                    <li>Affiche + PDFs uploadés</li>
                    <li>Redimensionnement automatique</li>
                    <li>Disposition intelligente</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <PrintOptionsModal
        show={showPrintOptions}
        onHide={() => setShowPrintOptions(false)}
        templateState={testPoster}
        canvasRef={canvasRef}
      />
    </Container>
  )
}

export default PrintTestComponent
