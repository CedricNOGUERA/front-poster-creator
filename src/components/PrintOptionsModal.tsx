import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap'
import { NewTemplateType } from '@/types/DiversType'
import { generatePDF, PrintOptions, PAGE_DIMENSIONS } from '@/utils/printUtils'
import PrintHelpModal from './PrintHelpModal'

interface PrintOptionsModalProps {
  show: boolean
  onHide: () => void
  templateState: NewTemplateType
  canvasRef: React.RefObject<HTMLDivElement | null>
}

interface PrintLayout {
  rows: number
  cols: number
  totalCopies: number
  spacing: number
}

interface PDFFile {
  id: string
  name: string
  file: File
  width: number
  height: number
  preview?: string
  status: 'pending' | 'processing' | 'ready' | 'error'
}

const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  show,
  onHide,
  templateState,
  canvasRef
}) => {
  const [printMode, setPrintMode] = useState<'single' | 'multiple' | 'combine'>('single')
  const [copiesPerPage, setCopiesPerPage] = useState(4)
  const [pageFormat, setPageFormat] = useState<'A4' | 'A3' | 'custom'>('A4')
  const [customWidth, setCustomWidth] = useState(210)
  const [customHeight, setCustomHeight] = useState(297)
  const [spacing, setSpacing] = useState(5)
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const currentPageDimensions = pageFormat === 'custom' 
    ? { width: customWidth, height: customHeight }
    : PAGE_DIMENSIONS[pageFormat]

  // Calculer le layout optimal pour les copies multiples
  const calculateLayout = (): PrintLayout => {
    if (!templateState.width || !templateState.height) {
      return { rows: 1, cols: 1, totalCopies: 1, spacing: 0 }
    }

    const posterWidth = templateState.width
    const posterHeight = templateState.height
    const availableWidth = currentPageDimensions.width - (spacing * 2)
    const availableHeight = currentPageDimensions.height - (spacing * 2)

    let bestLayout = { rows: 1, cols: 1, totalCopies: 1, spacing }
    let maxCopies = 1

    // Essayer différentes configurations
    for (let cols = 1; cols <= 10; cols++) {
      for (let rows = 1; rows <= 10; rows++) {
        const totalCopies = cols * rows
        if (totalCopies > copiesPerPage) continue

        const requiredWidth = (posterWidth * cols) + (spacing * (cols - 1))
        const requiredHeight = (posterHeight * rows) + (spacing * (rows - 1))

        if (requiredWidth <= availableWidth && requiredHeight <= availableHeight) {
          if (totalCopies > maxCopies) {
            maxCopies = totalCopies
            bestLayout = { rows, cols, totalCopies, spacing }
          }
        }
      }
    }

    return bestLayout
  }

  const layout = calculateLayout()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf') {
        const pdfFile: PDFFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          file: file,
          width: 210, // Dimensions par défaut
          height: 297,
          status: 'processing'
        }
        
        setUploadedPDFs(prev => [...prev, pdfFile])
        
        try {
          // Essayer de générer un aperçu du PDF
          const { convertPDFToSingleImage } = await import('@/utils/pdfConverterReal')
          const pdfPage = await convertPDFToSingleImage(file)
          
          setUploadedPDFs(prev => prev.map(pdf => 
            pdf.id === pdfFile.id 
              ? { 
                  ...pdf, 
                  width: (pdfPage.width / 5.67), 
                  height: (pdfPage.height / 5.67), 
                  preview: pdfPage.imageData,
                  status: 'ready' as const
                }
              : pdf
          ))
        } catch (error) {
          console.error('Erreur lors du traitement du PDF:', error)
          setUploadedPDFs(prev => prev.map(pdf => 
            pdf.id === pdfFile.id 
              ? { ...pdf, status: 'error' as const }
              : pdf
          ))
        }
      }
    }
  }

  const removePDF = (id: string) => {
    setUploadedPDFs(prev => prev.filter(pdf => pdf.id !== id))
  }


  const handleGenerate = async () => {
    if (!canvasRef.current) return

    // Validation pour le mode combinaison
    if (printMode === 'combine' && uploadedPDFs.length === 0) {
      alert('Veuillez sélectionner au moins un PDF à combiner.')
      return
    }

    // Vérifier que tous les PDFs sont prêts
    const processingPDFs = uploadedPDFs.filter(pdf => pdf.status === 'processing')
    if (processingPDFs.length > 0) {
      alert('Veuillez attendre que tous les PDFs soient traités.')
      return
    }

    setIsGenerating(true)
    try {
      const options: PrintOptions = {
        mode: printMode,
        pageFormat: pageFormat,
        customDimensions: pageFormat === 'custom' ? { width: customWidth, height: customHeight } : undefined,
        copiesPerPage: copiesPerPage,
        spacing: spacing,
        uploadedPDFs: uploadedPDFs.filter(pdf => pdf.status === 'ready').map(pdf => pdf.file)
      }

      

      await generatePDF(canvasRef.current, templateState, options)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF. Vérifiez la console pour plus de détails.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Options d'impression avancées</Modal.Title>
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => setShowHelp(true)}
          className="ms-2"
        >
          Aide
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Mode d'impression</Form.Label>
                <div className='d-flex flex-row justify-content-around border rounded-3 py-3'>
                  <Form.Check
                    type="radio"
                    label="Impression simple"
                    name="printMode"
                    value="single"
                    checked={printMode === 'single'}
                    onChange={(e) => setPrintMode(e.target.value as "single" | "multiple" | "combine")}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    label="Duplication sur une page"
                    name="printMode"
                    value="multiple"
                    checked={printMode === 'multiple'}
                    onChange={(e) => setPrintMode(e.target.value as "single" | "multiple" | "combine")}
                    inline
                  />
                  {/* <Form.Check
                    type="radio"
                    label="Combinaison de PDFs"
                    name="printMode"
                    value="combine"
                    checked={printMode === 'combine'}
                    onChange={(e) => setPrintMode(e.target.value as "single" | "multiple" | "combine")}
                    inline
                  /> */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {printMode === 'multiple' && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Format de page</Form.Label>
                    <Form.Select
                      value={pageFormat}
                      onChange={(e) => setPageFormat(e.target.value as "A4" | "A3" | "custom")}
                    >
                      <option value="A4">A4 (210 x 297 mm)</option>
                      <option value="A3">A3 (297 x 420 mm)</option>
                      <option value="custom">Personnalisé</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de copies souhaitées</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="20"
                      value={copiesPerPage}
                      onChange={(e) => setCopiesPerPage(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {pageFormat === 'custom' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Largeur (mm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hauteur (mm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Espacement entre les copies (mm)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="20"
                      value={spacing}
                      onChange={(e) => setSpacing(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Alert variant="info">
                <strong>Configuration calculée:</strong><br />
                {layout.rows} rangée(s) × {layout.cols} colonne(s) = {layout.totalCopies} copie(s)<br />
                Dimensions de l'affiche: {templateState.width} × {templateState.height} mm<br />
                Dimensions de la page: {currentPageDimensions.width} × {currentPageDimensions.height} mm
              </Alert>
            </>
          )}

          {printMode === 'combine' && (
            <>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Format de page de sortie</Form.Label>
                    <Form.Select
                      value={pageFormat}
                      onChange={(e) => setPageFormat(e.target.value as "A4" | "A3" | "custom")}
                    >
                      <option value="A4">A4 (210 x 297 mm)</option>
                      <option value="A3">A3 (297 x 420 mm)</option>
                      <option value="custom">Personnalisé</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {pageFormat === 'custom' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Largeur (mm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hauteur (mm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ajouter des PDFs à combiner</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <Form.Text className="text-muted">
                      Sélectionnez un ou plusieurs fichiers PDF à combiner avec l'affiche actuelle
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {uploadedPDFs.length > 0 && (
                <Row>
                  <Col md={12}>
                    <h6>PDFs sélectionnés:</h6>
                    {uploadedPDFs.map(pdf => {
                    console.log(pdf)
                   return (
                      <Card key={pdf.id} className="mb-2">
                        <Card.Body className="py-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              {pdf.status === 'processing' && (
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Chargement...</span>
                                </div>
                              )}
                              {pdf.status === 'ready' && pdf.preview && (
                                <img 
                                  src={pdf.preview} 
                                  alt="Aperçu" 
                                  style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px' }}
                                />
                              )}
                              {pdf.status === 'error' && (
                                <span className="text-danger me-2">❌</span>
                              )}
                              <div>
                                <div>{pdf.name}</div>
                                {pdf.status === 'ready' && (
                                  <small className="text-muted">
                                    {Math.round(pdf.width)} × {Math.round(pdf.height)} px
                                  </small>
                                )}
                                {pdf.status === 'error' && (
                                  <small className="text-danger">Erreur lors du traitement</small>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removePDF(pdf.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    )}
                    )}
                  </Col>
                </Row>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={isGenerating || (printMode === 'combine' && uploadedPDFs.length === 0) || uploadedPDFs.some(pdf => pdf.status === 'processing')}
        >
          {isGenerating ? 'Génération...' : 'Générer PDF'}
        </Button>
      </Modal.Footer>
      <PrintHelpModal
        show={showHelp}
        onHide={() => setShowHelp(false)}
      />
    </Modal>
  )
}

export default PrintOptionsModal
