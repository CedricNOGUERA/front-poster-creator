import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Button, Alert, ToggleButton, ButtonGroup } from 'react-bootstrap'
import PrintOptionsModalAdvanced from './PrintOptionsModalAdvanced'
import PDFConversionTest from './PDFConversionTest'
import { NewTemplateType } from '@/types/DiversType'

const FinalPrintTest: React.FC = () => {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [showConversionTest, setShowConversionTest] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

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
          <h2 className="mb-4">Test final - Combinaison de PDFs</h2>
          <Alert variant="success">
            <h5>✅ Problème résolu avec deux solutions</h5>
            <p>
              Le problème des PDFs "vides" est maintenant résolu avec deux approches :
            </p>
            <ul className="mb-0">
              <li><strong>Contenu réel :</strong> Extrait le contenu visuel du PDF (PDF.js via CDN)</li>
              <li><strong>Aperçu visuel :</strong> Crée un aperçu avec les informations du fichier</li>
            </ul>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Affiche de test</h5>
            </Card.Header>
            <Card.Body>
              <div
                ref={canvasRef}
                style={{
                  width: '200px',
                  height: '40px',
                  border: '2px solid #28a745',
                  backgroundColor: '#d4edda',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#155724'
                }}
              >
                TEST FINAL
              </div>
              <p className="text-muted text-center mt-2">
                Dimensions : 200 × 40 mm
              </p>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="success"
                onClick={() => setShowPrintOptions(true)}
                className="w-100"
              >
                Tester les options d'impression
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Test de conversion PDF</h5>
            </Card.Header>
            <Card.Body>
              <p>Testez d'abord la conversion des PDFs pour vérifier que le contenu est correctement extrait.</p>
              <Button
                variant="info"
                onClick={() => setShowConversionTest(true)}
                className="w-100"
              >
                Tester la conversion PDF
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <h5>🔧 Solutions implémentées</h5>
              <Row>
                <Col md={6}>
                  <h6>1. Conversion avec contenu réel</h6>
                  <ul>
                    <li>Utilise PDF.js via CDN</li>
                    <li>Extrait le contenu visuel du PDF</li>
                    <li>Qualité d'image optimale</li>
                    <li>Fallback vers aperçu visuel si échec</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>2. Aperçu visuel</h6>
                  <ul>
                    <li>Aucune dépendance externe</li>
                    <li>Icône PDF + informations du fichier</li>
                    <li>Fonctionne toujours</li>
                    <li>Solution de fallback robuste</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>📋 Instructions de test</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li><strong>Test de conversion :</strong> Cliquez sur "Tester la conversion PDF" et uploadez un PDF pour vérifier que le contenu est correctement extrait</li>
                <li><strong>Test de combinaison :</strong> Cliquez sur "Tester les options d'impression" et sélectionnez "Combinaison de PDFs"</li>
                <li><strong>Choisir le mode :</strong> Sélectionnez "Contenu réel" ou "Aperçu visuel" selon vos besoins</li>
                <li><strong>Uploader des PDFs :</strong> Sélectionnez un ou plusieurs PDFs à combiner</li>
                <li><strong>Générer le PDF :</strong> Cliquez sur "Générer PDF" et vérifiez que le PDF final contient l'affiche + les PDFs</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <PrintOptionsModalAdvanced
        show={showPrintOptions}
        onHide={() => setShowPrintOptions(false)}
        templateState={testPoster}
        canvasRef={canvasRef}
      />

      {showConversionTest && (
        <PDFConversionTest />
      )}
    </Container>
  )
}

export default FinalPrintTest
