import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap'
import { convertPDFToSingleImage } from '@/utils/pdfConverterReal'

const PDFConversionTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversionInfo, setConversionInfo] = useState<{
    width: number
    height: number
    pageNumber: number
  } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setConvertedImage(null)
      setError(null)
      setConversionInfo(null)
    } else {
      setError('Veuillez sélectionner un fichier PDF valide')
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setIsConverting(true)
    setError(null)

    try {
      const result = await convertPDFToSingleImage(selectedFile)
      setConvertedImage(result.imageData)
      setConversionInfo({
        width: result.width,
        height: result.height,
        pageNumber: result.pageNumber
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la conversion')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={12}>
          <h2 className="mb-4">Test de conversion PDF → Image</h2>
          <Alert variant="info">
            <h5>🔍 Test de la conversion réelle des PDFs</h5>
            <p>Ce composant permet de tester si les PDFs sont correctement convertis en images avec leur contenu réel.</p>
          </Alert>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Sélection du PDF</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Choisir un fichier PDF :</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
              </Form.Group>

              {selectedFile && (
                <div className="mb-3">
                  <h6>Fichier sélectionné :</h6>
                  <p className="text-muted">
                    <strong>Nom :</strong> {selectedFile.name}<br />
                    <strong>Taille :</strong> {(selectedFile.size / 1024).toFixed(1)} KB<br />
                    <strong>Type :</strong> {selectedFile.type}
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleConvert}
                disabled={!selectedFile || isConverting}
                className="w-100"
              >
                {isConverting ? 'Conversion...' : 'Convertir en image'}
              </Button>

              {error && (
                <Alert variant="danger" className="mt-3">
                  <strong>Erreur :</strong> {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Résultat de la conversion</h5>
            </Card.Header>
            <Card.Body>
              {convertedImage ? (
                <div>
                  <h6>Image générée :</h6>
                  <div className="text-center mb-3">
                    <img
                      src={convertedImage}
                      alt="PDF converti"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  {conversionInfo && (
                    <div className="mt-3">
                      <h6>Informations :</h6>
                      <ul className="list-unstyled">
                        <li><strong>Largeur :</strong> {Math.round(conversionInfo.width)} px</li>
                        <li><strong>Hauteur :</strong> {Math.round(conversionInfo.height)} px</li>
                        <li><strong>Page :</strong> {conversionInfo.pageNumber}</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted">
                  <p>Aucune image convertie</p>
                  <p>Sélectionnez un PDF et cliquez sur "Convertir"</p>
                </div>
              )}
            </Card.Body>
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
                  <h6>✅ Conversion réussie</h6>
                  <ul>
                    <li>L'image s'affiche correctement</li>
                    <li>Le contenu du PDF est visible</li>
                    <li>Les dimensions sont correctes</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>⚠️ Conversion partielle</h6>
                  <ul>
                    <li>Seul l'aperçu visuel s'affiche</li>
                    <li>Pas de contenu réel du PDF</li>
                    <li>Fallback vers la version simplifiée</li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>❌ Erreur de conversion</h6>
                  <ul>
                    <li>Message d'erreur affiché</li>
                    <li>PDF corrompu ou non supporté</li>
                    <li>Problème de chargement de PDF.js</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Alert variant="warning">
            <h5>💡 Note technique</h5>
            <p>
              Cette version utilise PDF.js via CDN pour extraire le contenu réel des PDFs. 
              Si la conversion échoue, le système bascule automatiquement vers un aperçu visuel.
            </p>
            <p>
              <strong>Si vous voyez seulement l'aperçu visuel :</strong> Le PDF.js n'a pas pu être chargé ou le PDF est corrompu.
            </p>
            <p>
              <strong>Si vous voyez le contenu réel :</strong> La conversion fonctionne parfaitement !
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}

export default PDFConversionTest
