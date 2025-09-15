import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import PrintOptionsModal from './PrintOptionsModal'
import { NewTemplateType } from '@/types/DiversType'

const PrintDemo: React.FC = () => {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Exemple d'affiche de démonstration
  const demoPoster: NewTemplateType = {
    width: 200,
    height: 40,
    idShop: 1,
    idCategory: 1,
    nameCategory: "",
    nameTemplate: "",
    orientation: "portait"
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <h2 className="mb-4">Démonstration des options d'impression</h2>
          <Alert variant="info">
            <h5>🎯 Fonctionnalités disponibles</h5>
            <ul className="mb-0">
              <li><strong>Duplication automatique :</strong> Place plusieurs copies d'une affiche sur une même page</li>
              <li><strong>Calcul intelligent :</strong> Optimise automatiquement l'espacement et le nombre de copies</li>
              <li><strong>Formats multiples :</strong> A4, A3, A5, A2, A1, A0 et formats personnalisés</li>
              <li><strong>Combinaison de PDFs :</strong> Combine différentes affiches sur une même page</li>
            </ul>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Exemple d'affiche (200×40 mm)</h5>
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
                AFFICHE DEMO
              </div>
              <p className="text-muted text-center mt-2">
                Dimensions : 200 × 40 mm
              </p>
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

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Exemples de résultats</h5>
            </Card.Header>
            <Card.Body>
              <h6>Sur une page A4 (210×297 mm) :</h6>
              <ul>
                <li><strong>4 copies</strong> en disposition 2×2</li>
                <li>Espacement automatique de 5mm</li>
                <li>Utilisation optimale de l'espace</li>
              </ul>

              <h6>Sur une page A3 (297×420 mm) :</h6>
              <ul>
                <li><strong>8 copies</strong> en disposition 4×2</li>
                <li>Espacement adaptatif</li>
                <li>Réduction des coûts d'impression</li>
              </ul>

              <h6>Format personnalisé :</h6>
              <ul>
                <li>Dimensions définies par l'utilisateur</li>
                <li>Calcul automatique du layout optimal</li>
                <li>Flexibilité maximale</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <h5>💡 Cas d'usage pratiques</h5>
              <Row>
                <Col md={4}>
                  <h6>🏪 Magasins</h6>
                  <p>Imprimez plusieurs étiquettes de prix sur une même feuille pour réduire les coûts.</p>
                </Col>
                <Col md={4}>
                  <h6>📋 Événements</h6>
                  <p>Créez des badges ou des étiquettes en série pour les participants.</p>
                </Col>
                <Col md={4}>
                  <h6>📦 Logistique</h6>
                  <p>Générez des étiquettes d'expédition en lot pour optimiser l'impression.</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <PrintOptionsModal
        show={showPrintOptions}
        onHide={() => setShowPrintOptions(false)}
        templateState={demoPoster}
        canvasRef={canvasRef}
      />
    </Container>
  )
}

export default PrintDemo
