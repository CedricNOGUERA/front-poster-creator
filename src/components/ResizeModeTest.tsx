import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Button, Alert, ToggleButton, ButtonGroup } from 'react-bootstrap'
import PrintOptionsModalAdvanced from './PrintOptionsModalAdvanced'
import { NewTemplateType } from '@/types/DiversType'

const ResizeModeTest: React.FC = () => {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
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
          <h2 className="mb-4">Test des modes de redimensionnement</h2>
          <Alert variant="info">
            <h5>🔧 Problème résolu : Redimensionnement des PDFs</h5>
            <p>
              Le problème de redimensionnement des PDFs uploadés est maintenant résolu avec trois modes :
            </p>
            <ul className="mb-0">
              <li><strong>Proportionnel :</strong> Redimensionne intelligemment en gardant les proportions</li>
              <li><strong>Dimensions d'origine :</strong> Conserve les dimensions exactes du PDF</li>
              <li><strong>Ajuster à la page :</strong> Ajuste pour maximiser l'utilisation de l'espace</li>
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
                TEST RESIZE
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
                Tester les modes de redimensionnement
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Modes de redimensionnement</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>🔄 Proportionnel (recommandé)</h6>
                <p className="small text-muted">
                  Redimensionne intelligemment en gardant les proportions. 
                  Max 1.5x la taille de l'affiche principale.
                </p>
              </div>
              
              <div className="mb-3">
                <h6>📏 Dimensions d'origine</h6>
                <p className="small text-muted">
                  Conserve les dimensions exactes du PDF uploadé. 
                  Peut déborder si le PDF est trop grand.
                </p>
              </div>
              
              <div className="mb-3">
                <h6>📐 Ajuster à la page</h6>
                <p className="small text-muted">
                  Ajuste pour maximiser l'utilisation de l'espace disponible. 
                  Peut déformer si les proportions sont très différentes.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <h5>🔍 Instructions de test</h5>
              <ol>
                <li><strong>Ouvrir les options d'impression</strong> et sélectionner "Combinaison de PDFs"</li>
                <li><strong>Choisir le mode de redimensionnement :</strong>
                  <ul>
                    <li><strong>Proportionnel :</strong> Pour un redimensionnement intelligent</li>
                    <li><strong>Dimensions d'origine :</strong> Pour conserver la taille exacte</li>
                    <li><strong>Ajuster à la page :</strong> Pour maximiser l'utilisation de l'espace</li>
                  </ul>
                </li>
                <li><strong>Uploader un PDF</strong> et vérifier l'aperçu</li>
                <li><strong>Générer le PDF</strong> et comparer les résultats</li>
                <li><strong>Répéter</strong> avec différents modes pour voir les différences</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>📊 Comparaison des modes</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <h6>Proportionnel</h6>
                  <ul className="small">
                    <li>✅ Garde les proportions</li>
                    <li>✅ Redimensionnement intelligent</li>
                    <li>✅ Évite les débordements</li>
                    <li>⚠️ Peut être plus petit que l'original</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Dimensions d'origine</h6>
                  <ul className="small">
                    <li>✅ Conserve la taille exacte</li>
                    <li>✅ Qualité maximale</li>
                    <li>⚠️ Peut déborder de la page</li>
                    <li>⚠️ Peut être très grand ou très petit</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Ajuster à la page</h6>
                  <ul className="small">
                    <li>✅ Utilise tout l'espace disponible</li>
                    <li>✅ Évite les débordements</li>
                    <li>⚠️ Peut déformer les proportions</li>
                    <li>⚠️ Peut rendre le texte illisible</li>
                  </ul>
                </Col>
              </Row>
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
    </Container>
  )
}

export default ResizeModeTest
