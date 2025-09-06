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
    // selectedGarantie,
    // setSelectedGarantie,
    pageWidth,
    pageHeight,
    printRef,
    // garantieImageParams,
    // setGarantieImageParams,
    canvasData,
    setCanvasData,
    // showGarantieSettings,
    // setShowGarantieSettings,
  } = warrantyPictureProps


  const [pictures, setPictures] = React.useState<PictureType[]>([]);
  const [additionalImages, setAdditionalImages] = React.useState<Array<{
    id: string
    selectedImage: string
    params: {
      width: number
      top: number
      left: number
    }
    showSettings: boolean
  }>>([])

  React.useEffect(() => {
    _getPictures(setPictures)
  }, [])


  const maxPreviewHeight = pageHeight < 100 ? 150 : 500
  const scaleFactor = maxPreviewHeight / pageHeight

  // Fonction utilitaire pour synchroniser les paramètres avec canvasData
    // const syncImageWithCanvas = (updates: Partial<{ width: number; top: number; left: number }>) => {
    //   if (selectedGarantie) {
    //     const updatedCanvas = canvasData.map((comp) => {
    //       if (
    //         comp.type === 'image' &&
    //         'src' in comp &&
    //         typeof comp.src === 'string' &&
    //         comp.src === selectedGarantie
    //       ) {
    //         return {
    //           ...comp,
    //           ...updates,
    //         }
    //       }
    //       return comp
    //     })
    //     setCanvasData(updatedCanvas)
    //   }
    // }

  // const moveImagePosition = (
  //   direction: 'up' | 'down' | 'left' | 'right',
  //   step: number = 10
  // ) => {
  //   const updates = { ...garantieImageParams }

  //   if (direction === 'up') {
  //     updates.top = Math.max(0, garantieImageParams.top - step)
  //   } else if (direction === 'down') {
  //     updates.top = Math.min(
  //       pageHeight * scaleFactor - garantieImageParams.width,
  //       garantieImageParams.top + step
  //     )
  //   } else if (direction === 'left') {
  //     updates.left = Math.max(0, garantieImageParams.left - step)
  //   } else if (direction === 'right') {
  //     updates.left = Math.min(
  //       pageWidth * scaleFactor - garantieImageParams.width,
  //       garantieImageParams.left + step
  //     )
  //   }

  //   setGarantieImageParams(updates)
  //   syncImageWithCanvas(updates)
  // }

  // Fonctions pour gérer les images supplémentaires
  const addNewImage = () => {
    const newImageId = `img_${Date.now()}`
    const MARGIN = 20
    const IMAGE_WIDTH = 80
    const IMAGE_HEIGHT = 100
    
    // Récupère la taille réelle du canvas
    let canvasWidth = pageWidth
    let canvasHeight = pageHeight
    if (printRef.current) {
      const rect = (printRef.current as HTMLElement).getBoundingClientRect()
      canvasWidth = rect.width
      canvasHeight = rect.height
    }
    
    const initialTop = canvasHeight - MARGIN - IMAGE_HEIGHT - (additionalImages.length * 120)
    const initialLeft = canvasWidth - MARGIN - IMAGE_WIDTH

    const newImage = {
      id: newImageId,
      selectedImage: '',
      params: {
        width: IMAGE_WIDTH,
        top: initialTop,
        left: initialLeft,
      },
      showSettings: false
    }

    setAdditionalImages([...additionalImages, newImage])
  }

  const removeImage = (imageId: string) => {
    // Supprime l'image du canvas
    const updatedCanvas = canvasData.filter(
      (comp) => !(comp.type === 'image' && 'id' in comp && comp.id === imageId)
    )
    setCanvasData(updatedCanvas)
    
    // Supprime l'image de la liste
    setAdditionalImages(additionalImages.filter(img => img.id !== imageId))
  }

  const updateImageInCanvas = (imageId: string, imageSrc: string, params: { width: number; top: number; left: number }) => {
    // Supprime l'ancienne image du canvas
    const filteredCanvas = canvasData.filter(
      (comp) => !(comp.type === 'image' && 'id' in comp && comp.id === imageId)
    )
    
    // Ajoute la nouvelle image si elle a une source
    if (imageSrc && imageSrc !== "aucune") {
      const imageComponent = {
        type: 'image',
        id: imageId,
        top: params.top,
        left: params.left,
        width: params.width,
        src: imageSrc,
      }
      setCanvasData([...filteredCanvas, imageComponent])
    } else {
      setCanvasData(filteredCanvas)
    }
  }

  const moveAdditionalImagePosition = (
    imageId: string,
    direction: 'up' | 'down' | 'left' | 'right',
    step: number = 10
  ) => {
    const image = additionalImages.find(img => img.id === imageId)
    if (!image) return

    const updates = { ...image.params }

    if (direction === 'up') {
      updates.top = Math.max(0, image.params.top - step)
    } else if (direction === 'down') {
      updates.top = Math.min(
        pageHeight * scaleFactor - image.params.width,
        image.params.top + step
      )
    } else if (direction === 'left') {
      updates.left = Math.max(0, image.params.left - step)
    } else if (direction === 'right') {
      updates.left = Math.min(
        pageWidth * scaleFactor - image.params.width,
        image.params.left + step
      )
    }

    // Met à jour l'état local
    setAdditionalImages(additionalImages.map(img => 
      img.id === imageId 
        ? { ...img, params: updates }
        : img
    ))

    // Met à jour le canvas
    updateImageInCanvas(imageId, image.selectedImage, updates)
  }

  return (
    <>
    
    
    {additionalImages.map((image, index) => (
            <Card key={image.id} className="mb-3 border">
              <Card.Header className="d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-image text-secondary"></i>
                  <span className="fw-bold">Image {index + 1}</span>
                </div>
                <div className="d-flex gap-2">
                  <Form.Check
                    type="switch"
                    id={`toggle-${image.id}`}
                    checked={image.showSettings}
                    onChange={() => {
                      setAdditionalImages(additionalImages.map(img => 
                        img.id === image.id 
                          ? { ...img, showSettings: !img.showSettings }
                          : img
                      ))
                    }}
                  />
                  <i
                    className="fas fa-cog fs-6 cursor-pointer text-muted"
                    onClick={() => {
                      setAdditionalImages(additionalImages.map(img => 
                        img.id === image.id 
                          ? { ...img, showSettings: !img.showSettings }
                          : img
                      ))
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Paramètres avancés"
                  />
                  <i
                    className="fas fa-trash text-danger cursor-pointer"
                    onClick={() => removeImage(image.id)}
                    style={{ cursor: 'pointer' }}
                    title="Supprimer cette image"
                  />
                </div>
              </Card.Header>
              <Card.Body className="py-2">
                <Form.Group className="mb-3">
                  <Form.Select
                    value={image.selectedImage}
                    onChange={(e) => {
                      const imageSrc = e.target.value
                      setAdditionalImages(additionalImages.map(img => 
                        img.id === image.id 
                          ? { ...img, selectedImage: imageSrc }
                          : img
                      ))
                      updateImageInCanvas(image.id, imageSrc, image.params)
                    }}
                  >
                    <option value="aucune">Aucune</option>
                    {pictures.map((pict) => (
                      <option key={pict.id} value={pict.src}>{pict.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {image.showSettings && (
                  <div className="custom-value d-flex flex-column gap-3">
                    <div>
                      {/* Contrôles de taille */}
                      <Form.Group>
                        <Form.Label className="fw-bold small">
                          <i className="fas fa-expand-arrows-alt me-2"></i>
                          Redimension
                        </Form.Label>
                        <Form.Range
                          min={40}
                          max={300}
                          value={image.params.width}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value)
                            const updatedParams = { ...image.params, width: newWidth }
                            setAdditionalImages(additionalImages.map(img => 
                              img.id === image.id 
                                ? { ...img, params: updatedParams }
                                : img
                            ))
                            updateImageInCanvas(image.id, image.selectedImage, updatedParams)
                          }}
                        />
                      </Form.Group>

                      {/* Boutons de déplacement rapide */}
                      <Form.Label className="fw-bold mb-2 small">
                        <i className="fas fa-arrows-alt me-2"></i>
                        Position
                      </Form.Label>

                      <div className="d-flex justify-content-center mb-2">
                        <ButtonGroup size="sm">
                          <Button
                            variant="outline-secondary"
                            onClick={() => moveAdditionalImagePosition(image.id, 'up', 10)}
                            title="Déplacer vers le haut"
                          >
                            <i className="fas fa-arrow-up"></i>
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => moveAdditionalImagePosition(image.id, 'down', 10)}
                            title="Déplacer vers le bas"
                          >
                            <i className="fas fa-arrow-down"></i>
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => moveAdditionalImagePosition(image.id, 'left', 10)}
                            title="Déplacer vers la gauche"
                          >
                            <i className="fas fa-arrow-left"></i>
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => moveAdditionalImagePosition(image.id, 'right', 10)}
                            title="Déplacer vers la droite"
                          >
                            <i className="fas fa-arrow-right"></i>
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>

                    {/* Contrôles de position */}
                    <div className="row g-2">
                      <div className="col-6">
                        <Form.Label className="small">
                          <i className="fas fa-arrows-up-down me-1"></i>
                          Vert.
                        </Form.Label>
                        <Form.Range
                          min={0}
                          max={pageHeight * scaleFactor}
                          step={1}
                          value={image.params.top}
                          onChange={(e) => {
                            const newTop = parseInt(e.target.value)
                            const updatedParams = { ...image.params, top: newTop }
                            setAdditionalImages(additionalImages.map(img => 
                              img.id === image.id 
                                ? { ...img, params: updatedParams }
                                : img
                            ))
                            updateImageInCanvas(image.id, image.selectedImage, updatedParams)
                          }}
                        />
                        <Form.Control
                          type="number"
                          min={0}
                          max={pageHeight * scaleFactor}
                          step={1}
                          value={image.params.top}
                          onChange={(e) => {
                            const newTop = parseInt(e.target.value) || 0
                            const updatedParams = { ...image.params, top: newTop }
                            setAdditionalImages(additionalImages.map(img => 
                              img.id === image.id 
                                ? { ...img, params: updatedParams }
                                : img
                            ))
                            updateImageInCanvas(image.id, image.selectedImage, updatedParams)
                          }}
                          size="sm"
                          className="mt-1"
                        />
                      </div>

                      <div className="col-6">
                        <Form.Label className="small">
                          <i className="fas fa-arrows-left-right me-1"></i>
                          Horiz.
                        </Form.Label>
                        <Form.Range
                          min={0}
                          max={pageWidth * scaleFactor}
                          step={1}
                          value={image.params.left}
                          onChange={(e) => {
                            const newLeft = parseInt(e.target.value)
                            const updatedParams = { ...image.params, left: newLeft }
                            setAdditionalImages(additionalImages.map(img => 
                              img.id === image.id 
                                ? { ...img, params: updatedParams }
                                : img
                            ))
                            updateImageInCanvas(image.id, image.selectedImage, updatedParams)
                          }}
                        />
                        <Form.Control
                          type="number"
                          min={0}
                          max={pageWidth * scaleFactor}
                          step={1}
                          value={image.params.left}
                          onChange={(e) => {
                            const newLeft = parseInt(e.target.value) || 0
                            const updatedParams = { ...image.params, left: newLeft }
                            setAdditionalImages(additionalImages.map(img => 
                              img.id === image.id 
                                ? { ...img, params: updatedParams }
                                : img
                            ))
                            updateImageInCanvas(image.id, image.selectedImage, updatedParams)
                          }}
                          size="sm"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
    <Button
              variant="outline-primary"
              size="sm"
              onClick={addNewImage}
              className="d-flex align-items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Ajouter une image
            </Button>
    </>
  )
}
