import React from 'react'
import { Form, Button, ButtonGroup, InputGroup } from 'react-bootstrap'
import { ComponentTypeMulti, TextComponentType, NumberComponentType, PrincipalPriceComponentType } from '@/types/ComponentType'
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowsLeftRight, FaArrowsUpDown, FaArrowUp } from 'react-icons/fa6'
import { FaArrowsAlt } from 'react-icons/fa'

interface PositionControlsProps {
  component: TextComponentType | NumberComponentType | PrincipalPriceComponentType
  index: number
  canvasData: ComponentTypeMulti[]
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>
  pageWidth: number
  pageHeight: number
  scaleFactor: number
}

export default function PositionControls({
  component,
  index,
  canvasData,
  setCanvasData,
  pageWidth,
  pageHeight,
  scaleFactor
}: PositionControlsProps) {
  
  const updateComponent = (updates: Partial<ComponentTypeMulti>) => {
    const updatedCanvas = [...canvasData]
    updatedCanvas[index] = {
      ...updatedCanvas[index],
      ...updates,
    }
    setCanvasData(updatedCanvas)
  }

  const movePosition = (direction: 'up' | 'down' | 'left' | 'right', step: number = 5) => {
    if (component.type === 'price' || component.type === 'number') {
      // Pour les prix et nombres, on utilise bottom et right
      const updates: Partial<NumberComponentType | PrincipalPriceComponentType> = {}
      if (direction === 'up') updates.bottom = Math.max(0, (component.bottom || 0) + step)
      if (direction === 'down') updates.bottom = Math.min(pageHeight * scaleFactor, (component.bottom || 0) - step)
      if (direction === 'left') updates.right = Math.max(-pageWidth * 2, (component.right || 0) + step)
      if (direction === 'right') updates.right = Math.min(pageWidth * 2, (component.right || 0) - step)
      updateComponent(updates)
    } else {
      // Pour les textes, on utilise top et left
      const updates: Partial<TextComponentType> = {}
      if (direction === 'up') updates.top = Math.max(0, (component.top || 0) - step)
      if (direction === 'down') updates.top = Math.min(pageHeight * scaleFactor, (component.top || 0) + step)
      if (direction === 'left') updates.left = Math.max(0, (component.left || 0) - step)
      if (direction === 'right') updates.left = Math.min(pageWidth * scaleFactor, (component.left || 0) + step)
      updateComponent(updates)
    }
  }


  return (
    <div className="position-controls">
      {/* Contrôles de déplacement avec boutons directionnels */}
      <div className="mb-3">
        <Form.Label className="fw-bold">
          <FaArrowsAlt className="me-2" />
          Position
        </Form.Label>

        {/* Boutons de déplacement rapide */}
        <div className="d-flex justify-content-center mb-2">
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => movePosition("up", 10)}
              title="Déplacer vers le haut"
            >
              <FaArrowUp />
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => movePosition("down", 10)}
              title="Déplacer vers le bas"
            >
              <FaArrowDown />
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => movePosition("left", 10)}
              title="Déplacer vers la gauche"
            >
              <FaArrowLeft />
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => movePosition("right", 10)}
              title="Déplacer vers la droite"
            >
              <FaArrowRight />
            </Button>
          </ButtonGroup>
        </div>

        {/* Contrôles précis avec inputs numériques */}
        <div className="row g-2">
          {/* Position verticale */}
          <div className="col-6">
            <Form.Label className="small">
              <FaArrowsUpDown className="me-1" />
              Vert.
            </Form.Label>
            <Form.Range
              min={0}
              max={pageHeight * scaleFactor}
              step={1}
              value={
                component.type === "price" || component.type === "number"
                  ? component.bottom || 0
                  : component.top || 0
              }
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (component.type === "price" || component.type === "number") {
                  updateComponent({
                    bottom: value,
                  } as Partial<
                    NumberComponentType | PrincipalPriceComponentType
                  >);
                } else {
                  updateComponent({
                    top: value,
                  } as Partial<TextComponentType>);
                }
              }}
            />
            <InputGroup size="sm">
              <Form.Control
                type="number"
                min={0}
                max={
                  component.type === "price" || component.type === "number"
                    ? pageHeight * scaleFactor
                    : pageHeight * scaleFactor
                }
                step={1}
                value={
                  component.type === "price" || component.type === "number"
                    ? component.bottom || 0
                    : component.top || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (
                    component.type === "price" ||
                    component.type === "number"
                  ) {
                    updateComponent({ bottom: value } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >);
                  } else {
                    updateComponent({
                      top: value,
                    } as Partial<TextComponentType>);
                  }
                }}
              />
            </InputGroup>
          </div>

          {/* Position horizontale (old) */}
          {/* <div className='col-6'>
            <Form.Label className='small'>
              <FaArrowsLeftRight className='me-1' />
              Horiz.
            </Form.Label>
            <Form.Range
              min={
                component.type === 'price' || component.type === 'number' ? - pageWidth * 2 : 0
              }
              max={
                component.type === 'price' || component.type === 'number'
                  ? pageWidth * 2
                  : pageWidth * scaleFactor
              }
              step={1}
              value={
                component.type === 'price' || component.type === 'number'
                  ? component.right || 0
                  : component.left || 0
              }
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                if (component.type === 'price' || component.type === 'number') {
                  updateComponent({
                    right: value,
                  } as Partial<NumberComponentType | PrincipalPriceComponentType>)
                } else {
                  updateComponent({
                    left: value,
                  } as Partial<TextComponentType>)
                }
              }}
            />
            <InputGroup size='sm'>

              <Form.Control
                type='number'
                min={
                  component.type === 'price' || component.type === 'number'
                    ? -pageWidth * 2
                    : 0
                }
                max={
                  component.type === 'price' || component.type === 'number'
                    ? pageWidth * 2
                    : pageWidth * scaleFactor
                }
                step={1}
                value={
                  component.type === 'price' || component.type === 'number'
                    ? component.right || 0
                    : component.left || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  if (component.type === 'price' || component.type === 'number') {
                    updateComponent({ right: value } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >)
                  } else {
                    updateComponent({ left: value } as Partial<TextComponentType>)
                  }
                }}
              />

            </InputGroup>
          </div> */}

          {/* Position horizontale */}
          <div className="col-6">
            <Form.Label className="small">
              <FaArrowsLeftRight className="me-1" />
              Horiz.
            </Form.Label>
            <Form.Range
              min={0}
              max={pageWidth * scaleFactor}
              step={1}
              value={
                component.type === "price" || component.type === "number"
                  ? pageWidth * scaleFactor - (component.right || 0) // Inversion ici
                  : component.left || 0
              }
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (component.type === "price" || component.type === "number") {
                  updateComponent({
                    right: pageWidth * scaleFactor - value, // Inversion ici
                  } as Partial<
                    NumberComponentType | PrincipalPriceComponentType
                  >);
                } else {
                  updateComponent({
                    left: value,
                  } as Partial<TextComponentType>);
                }
              }}
            />
            <InputGroup size="sm">
              <Form.Control
                type="number"
                min={0}
                max={pageWidth * scaleFactor}
                step={1}
                value={
                  component.type === "price" || component.type === "number"
                    ? pageWidth * scaleFactor - (component.right || 0) // Inversion ici
                    : component.left || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (
                    component.type === "price" ||
                    component.type === "number"
                  ) {
                    updateComponent({
                      right: pageWidth * scaleFactor - value,
                    } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >);
                  } else {
                    updateComponent({
                      left: value,
                    } as Partial<TextComponentType>);
                  }
                }}
              />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
