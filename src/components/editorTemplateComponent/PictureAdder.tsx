import { ComponentTypeMulti } from '@/types/ComponentType'
import { PictureType } from '@/types/DiversType'
import { _getPictures } from '@/utils/apiFunctions'
import React from 'react'
import { Card, Form, Button, ButtonGroup } from 'react-bootstrap'

interface WarrantyPictureType {
  selectedGarantie: string
  setSelectedGarantie: React.Dispatch<React.SetStateAction<string>>
  pageWidth: number
  pageHeight: number
  printRef: React.RefObject<null>
  garantieImageParams: {
    width: number
    top: number
    left: number
  }
  setGarantieImageParams: React.Dispatch<
    React.SetStateAction<{
      width: number
      top: number
      left: number
    }>
  >
  canvasData: ComponentTypeMulti[]
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>
  showGarantieSettings: boolean
  setShowGarantieSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PictureAdder({
  warrantyPictureProps,
}: {
  warrantyPictureProps: WarrantyPictureType
}) {
  const {
    selectedGarantie,
    setSelectedGarantie,
    pageWidth,
    pageHeight,
    printRef,
    garantieImageParams,
    setGarantieImageParams,
    canvasData,
    setCanvasData,
    showGarantieSettings,
    setShowGarantieSettings,
  } = warrantyPictureProps


  const [pictures, setPictures] = React.useState<PictureType[]>([]);


  React.useEffect(() => {
    _getPictures(setPictures)
  }, [])


  const maxPreviewHeight = pageHeight < 100 ? 150 : 500
  const scaleFactor = maxPreviewHeight / pageHeight

  // Fonction utilitaire pour synchroniser les paramètres avec canvasData
  const syncImageWithCanvas = (updates: Partial<{ width: number; top: number; left: number }>) => {
    if (selectedGarantie) {
      const updatedCanvas = canvasData.map((comp) => {
        if (
          comp.type === 'image' &&
          'src' in comp &&
          typeof comp.src === 'string' &&
          comp.src === selectedGarantie
        ) {
          return {
            ...comp,
            ...updates,
          }
        }
        return comp
      })
      setCanvasData(updatedCanvas)
    }
  }

  const moveImagePosition = (
    direction: 'up' | 'down' | 'left' | 'right',
    step: number = 10
  ) => {
    const updates = { ...garantieImageParams }

    if (direction === 'up') {
      updates.top = Math.max(0, garantieImageParams.top - step)
    } else if (direction === 'down') {
      updates.top = Math.min(
        pageHeight * scaleFactor - garantieImageParams.width,
        garantieImageParams.top + step
      )
    } else if (direction === 'left') {
      updates.left = Math.max(0, garantieImageParams.left - step)
    } else if (direction === 'right') {
      updates.left = Math.min(
        pageWidth * scaleFactor - garantieImageParams.width,
        garantieImageParams.left + step
      )
    }

    setGarantieImageParams(updates)
    syncImageWithCanvas(updates)
  }

  return (
    <Card className='shadow-sm'>
      <Card.Header className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-2'>
          <i className={`fas fa-image text-primary`}></i>
          <span className='fw-bold text-capitalize'>Image</span>
        </div>
        <div className='d-flex gap-2'>
          <Form.Check
            type='switch'
            id={`toggle-picture`}
            checked={showGarantieSettings || false}
            onChange={() => setShowGarantieSettings(!showGarantieSettings)}
          />
          <i
            className='fas fa-cog fs-5 cursor-pointer text-muted'
            onClick={() => setShowGarantieSettings(!showGarantieSettings)}
            style={{ cursor: 'pointer' }}
            title='Paramètres avancés'
          />
        </div>
      </Card.Header>
      <Card.Body>
        <Form.Group className='mb-4' controlId='garantie'>
          <div className='d-flex align-items-center gap-2'>
            <Form.Select
              value={selectedGarantie}
              onChange={(e) => {
                const garantieValue = e.target.value
                setSelectedGarantie(garantieValue)
                const garantieSrc = e.target.value
                // let garantieSrc = ''
                // if (garantieValue === '6mois') {
                //   garantieSrc = '/uploads/garantie-6-mois.png'
                // } else if (garantieValue === '1an') {
                //   garantieSrc = '/uploads/garantie-1-an.png'
                // } else if (garantieValue === '2ans') {
                //   garantieSrc = '/uploads/garantie-2-ans.png'
                // } else {
                //   garantieSrc = ''
                // }
                // Récupère la taille réelle du canvas
                let canvasWidth = pageWidth
                let canvasHeight = pageHeight
                if (printRef.current) {
                  const rect = (printRef.current as HTMLElement).getBoundingClientRect()
                  canvasWidth = rect.width
                  canvasHeight = rect.height
                }
                // Position initiale en bas à droite
                const MARGIN = 20
                const IMAGE_WIDTH = 80
                const IMAGE_HEIGHT = 100
                const initialTop = canvasHeight - MARGIN - IMAGE_HEIGHT
                const initialLeft = canvasWidth - MARGIN - IMAGE_WIDTH
                // Met à jour les paramètres initiaux
                setGarantieImageParams({
                  width: IMAGE_WIDTH,
                  top: initialTop,
                  left: initialLeft,
                })
                const garantieComponent = {
                  type: 'image',
                  top: initialTop,
                  left: initialLeft,
                  width: IMAGE_WIDTH,
                  src: garantieSrc,
                }
      
                const filteredCanvas = canvasData.filter(
                  (comp) =>
                    !(
                      comp.type === 'image' &&
                      'src' in comp &&
                      typeof comp.src === 'string' &&
                      comp.src.includes('garantie-')
                    )
                )
                if (garantieSrc && garantieSrc !== "aucune") {
                  setCanvasData([...filteredCanvas, garantieComponent])
                } else {
                  setCanvasData(filteredCanvas)
                }
              }}
            >
              <option value="aucune">Aucune</option>
              {pictures.map((pict) => (
                <option key={pict.id} value={pict.src}>{pict.name}</option>
              ))}
            </Form.Select>
          </div>
          {showGarantieSettings && (
            <div className='custom-value d-flex flex-column gap-3 mt-3'>
              <div>
                {/* Contrôles de taille */}
                <Form.Group>
                  <Form.Label className='fw-bold'>
                    <i className='fas fa-expand-arrows-alt me-2'></i>
                    Redimension
                  </Form.Label>
                  <Form.Range
                    min={40}
                    max={300}
                    value={garantieImageParams.width}
                    onChange={(e) => {
                      const newWidth = parseInt(e.target.value)
                      setGarantieImageParams((params) => ({
                        ...params,
                        width: newWidth,
                      }))
                      syncImageWithCanvas({ width: newWidth })
                    }}
                  />
                </Form.Group>
                {/* Boutons de déplacement rapide */}
                <Form.Label className='fw-bold mb-2'>
                  <i className='fas fa-arrows-alt me-2'></i>
                  Position
                </Form.Label>

                {/* Boutons directionnels */}
                <div className='d-flex justify-content-center mb-2'>
                  <ButtonGroup size='sm'>
                    <Button
                      variant='outline-secondary'
                      onClick={() => moveImagePosition('up', 10)}
                      title='Déplacer vers le haut'
                    >
                      <i className='fas fa-arrow-up'></i>
                    </Button>
                    <Button
                      variant='outline-secondary'
                      onClick={() => moveImagePosition('down', 10)}
                      title='Déplacer vers le bas'
                    >
                      <i className='fas fa-arrow-down'></i>
                    </Button>
                    <Button
                      variant='outline-secondary'
                      onClick={() => moveImagePosition('left', 10)}
                      title='Déplacer vers la gauche'
                    >
                      <i className='fas fa-arrow-left'></i>
                    </Button>
                    <Button
                      variant='outline-secondary'
                      onClick={() => moveImagePosition('right', 10)}
                      title='Déplacer vers la droite'
                    >
                      <i className='fas fa-arrow-right'></i>
                    </Button>
                  </ButtonGroup>
                </div>
              </div>

              {/* Contrôles de position */}
              <div className='row g-2'>
                <div className='col-6'>
                  <Form.Label className='small'>
                    <i className='fas fa-arrows-up-down me-1'></i>
                    Vert.
                  </Form.Label>
                  <Form.Range
                    min={0}
                    max={pageHeight * scaleFactor}
                    step={1}
                    value={garantieImageParams.top}
                    onChange={(e) => {
                      const newTop = parseInt(e.target.value)
                      setGarantieImageParams((params) => ({
                        ...params,
                        top: newTop,
                      }))
                      syncImageWithCanvas({ top: newTop })
                    }}
                  />
                  <Form.Control
                    type='number'
                    min={0}
                    max={pageHeight * scaleFactor}
                    step={1}
                    value={garantieImageParams.top}
                    onChange={(e) => {
                      const newTop = parseInt(e.target.value) || 0
                      setGarantieImageParams((params) => ({
                        ...params,
                        top: newTop,
                      }))
                      syncImageWithCanvas({ top: newTop })
                    }}
                    size='sm'
                    className='mt-1'
                  />
                </div>

                <div className='col-6'>
                  <Form.Label className='small'>
                    <i className='fas fa-arrows-left-right me-1'></i>
                    Horiz.
                  </Form.Label>
                  <Form.Range
                    min={0}
                    max={pageWidth * scaleFactor}
                    step={1}
                    value={garantieImageParams.left}
                    onChange={(e) => {
                      const newLeft = parseInt(e.target.value)
                      setGarantieImageParams((params) => ({
                        ...params,
                        left: newLeft,
                      }))
                      syncImageWithCanvas({ left: newLeft })
                    }}
                  />
                  <Form.Control
                    type='number'
                    min={0}
                    max={pageWidth * scaleFactor}
                    step={1}
                    value={garantieImageParams.left}
                    onChange={(e) => {
                      const newLeft = parseInt(e.target.value) || 0
                      setGarantieImageParams((params) => ({
                        ...params,
                        left: newLeft,
                      }))
                      syncImageWithCanvas({ left: newLeft })
                    }}
                    size='sm'
                    className='mt-1'
                  />
                </div>
              </div>
            </div>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  )
}
