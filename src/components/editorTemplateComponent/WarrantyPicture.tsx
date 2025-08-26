import { ComponentTypeMulti } from '@/types/ComponentType'
import React from 'react'
import { Form } from 'react-bootstrap'

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

export default function WarrantyPicture({
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
  return (
    <Form.Group className='mb-4' controlId='garantie'>
      <div className='d-flex align-items-center gap-2'>
        <Form.Select
          value={selectedGarantie}
          onChange={(e) => {
            const garantieValue = e.target.value
            setSelectedGarantie(garantieValue)
            let garantieSrc = ''
            if (garantieValue === '6mois') {
              garantieSrc = import.meta.env.VITE_API_URL + '/uploads/garantie-6-mois.png'
            } else if (garantieValue === '1an') {
              garantieSrc = import.meta.env.VITE_API_URL + '/uploads/garantie-1-an.png'
            } else if (garantieValue === '2ans') {
              garantieSrc = import.meta.env.VITE_API_URL + '/uploads/garantie-2-ans.png'
            } else {
              garantieSrc = ''
            }
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
            if (garantieSrc) {
              setCanvasData([...filteredCanvas, garantieComponent])
            } else {
              setCanvasData(filteredCanvas)
            }
          }}
        >
          <option value='6mois'>Garantie 6 mois</option>
          <option value='1an'>Garantie 1 an</option>
          <option value='2ans'>Garantie 2 ans</option>
          <option value='aucune'>Aucune garantie</option>
        </Form.Select>
        <i
          className='fas fa-cog fs-5 cursor-pointer'
          onClick={() => setShowGarantieSettings(!showGarantieSettings)}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {showGarantieSettings && (
        <div className='custom-value d-flex flex-column gap-2 mt-3'>
          <Form.Group>
            <Form.Label>Largeur</Form.Label>
            <Form.Range
              min={40}
              max={300}
              value={garantieImageParams.width}
              onChange={(e) =>
                setGarantieImageParams((params) => ({
                  ...params,
                  width: parseInt(e.target.value),
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Position verticale</Form.Label>
            <Form.Range
              min={0}
              max={pageHeight}
              value={garantieImageParams.top}
              onChange={(e) =>
                setGarantieImageParams((params) => ({
                  ...params,
                  top: parseInt(e.target.value),
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Position horizontale</Form.Label>
            <Form.Range
              min={0}
              max={pageWidth * 3}
              value={garantieImageParams.left}
              onChange={(e) =>
                setGarantieImageParams((params) => ({
                  ...params,
                  left: parseInt(e.target.value),
                }))
              }
            />
          </Form.Group>
        </div>
      )}
    </Form.Group>
  )
}
