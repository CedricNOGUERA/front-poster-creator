import React from 'react'
import { Form, Button, ButtonGroup, InputGroup } from 'react-bootstrap'
import { ComponentTypeMulti, TextComponentType, NumberComponentType, PrincipalPriceComponentType } from '@/types/ComponentType'

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
      if (direction === 'up') updates.bottom = Math.max(0, (component.bottom || 0) - step)
      if (direction === 'down') updates.bottom = Math.min(pageHeight * scaleFactor, (component.bottom || 0) + step)
      if (direction === 'left') updates.right = Math.max(-pageWidth * 2, (component.right || 0) - step)
      if (direction === 'right') updates.right = Math.min(pageWidth * 2, (component.right || 0) + step)
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


//   const centerPositionVertical = () => {
//     if (component.type === 'price' || component.type === 'number') {
//       updateComponent({ 
//         bottom: ((pageHeight * scaleFactor) / 2)/2, 
//         // right: (pageWidth * scaleFactor) / 2 
//       } as Partial<NumberComponentType | PrincipalPriceComponentType>)
//     } else {
//       updateComponent({ 
//         top: ((pageHeight * scaleFactor) / 2), 
//         // left: (pageWidth * scaleFactor) / 2 
//       } as Partial<TextComponentType>)
//     }
//   }
//   const centerPositionHorizontal = () => {
//     if (component.type === 'price' || component.type === 'number') {
//       updateComponent({ 
//         // bottom: ((pageHeight * scaleFactor) / 2)/2, 
//         right: (pageWidth * scaleFactor) / 2 
//       } as Partial<NumberComponentType | PrincipalPriceComponentType>)
//     } else {
//       updateComponent({ 
//         // top: ((pageHeight * scaleFactor) / 2), 
//         left: (pageWidth * scaleFactor) / 2 
//       } as Partial<TextComponentType>)
//     }
//   }

  return (
    <div className='position-controls'>
      {/* Contrôles de déplacement avec boutons directionnels */}
      <div className='mb-3'>
        <Form.Label className='fw-bold'>
          <i className='fas fa-arrows-alt me-2'></i>
          Position
        </Form.Label>

        {/* Boutons de déplacement rapide */}
        <div className='d-flex justify-content-center mb-2'>
          <ButtonGroup size='sm'>
            <Button
              variant='outline-secondary'
              onClick={() => movePosition('up', 10)}
              title='Déplacer vers le haut'
            >
              <i className='fas fa-arrow-up'></i>
            </Button>
            <Button
              variant='outline-secondary'
              onClick={() => movePosition('down', 10)}
              title='Déplacer vers le bas'
            >
              <i className='fas fa-arrow-down'></i>
            </Button>
            <Button
              variant='outline-secondary'
              onClick={() => movePosition('left', 10)}
              title='Déplacer vers la gauche'
            >
              <i className='fas fa-arrow-left'></i>
            </Button>
            <Button
              variant='outline-secondary'
              onClick={() => movePosition('right', 10)}
              title='Déplacer vers la droite'
            >
              <i className='fas fa-arrow-right'></i>
            </Button>
          </ButtonGroup>
        </div>

        {/* Boutons de positionnement rapide */}
        {/* <div className="d-flex justify-content-center gap-2 mb-3">
         
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={centerPositionVertical}
            title="Centrer l'élément"
          >
            <i className="fas fa-crosshairs me-1"></i>
            Centrer V
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={centerPositionHorizontal}
            title="Centrer l'élément"
          >
            <i className="fas fa-crosshairs me-1"></i>
            Centrer H
          </Button>
        </div> */}

        {/* Contrôles précis avec inputs numériques */}
        <div className='row g-2'>
          {/* Position verticale */}
          <div className='col-6'>
            <Form.Label className='small'>
              <i className='fas fa-arrows-up-down me-1'></i>
              Vert.
            </Form.Label>
                         <Form.Range
                 min={0}
                 max={pageHeight * scaleFactor}
                 step={1}
                 value={
                     component.type === 'price' || component.type === 'number'
                       ? component.bottom || 0
                       : component.top || 0
                   }
                 onChange={(e) => {
                   const value = parseInt(e.target.value) || 0
                   if (component.type === 'price' || component.type === 'number') {
                     updateComponent({
                       bottom: value,
                     } as Partial<NumberComponentType | PrincipalPriceComponentType>)
                   } else {
                     updateComponent({
                       top: value,
                     } as Partial<TextComponentType>)
                   }
                 }}
               />
            <InputGroup size='sm'>
           
              <Form.Control
                type='number'
                min={0}
                max={
                  component.type === 'price' || component.type === 'number'
                    ? pageHeight * scaleFactor
                    : pageHeight * scaleFactor
                }
                step={1}
                value={
                  component.type === 'price' || component.type === 'number'
                    ? component.bottom || 0
                    : component.top || 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  if (component.type === 'price' || component.type === 'number') {
                    updateComponent({ bottom: value } as Partial<
                      NumberComponentType | PrincipalPriceComponentType
                    >)
                  } else {
                    updateComponent({ top: value } as Partial<TextComponentType>)
                  }
                }}
              />
              {/* <Button
                variant='outline-secondary'
                size='sm'
                onClick={() =>
                  movePosition(
                    component.type === 'price' || component.type === 'number' ? 'up' : 'down',
                    1
                  )
                }
              >
                <i className='fas fa-plus'></i>
              </Button>
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={() =>
                  movePosition(
                    component.type === 'price' || component.type === 'number'
                      ? 'down'
                      : 'up',
                    1
                  )
                }
              >
               <small> <i className='fas fa-minus'></i></small>
              </Button> */}
            </InputGroup>
           
          </div>

          {/* Position horizontale */}
          <div className='col-6'>
            <Form.Label className='small'>
              <i className='fas fa-arrows-left-right me-1'></i>
              {/* {component.type === 'price' || component.type === 'number' ? 'Droite' : 'Gauche'} */}
              Horiz.
            </Form.Label>
                         <Form.Range
                 min={component.type === 'price' || component.type === 'number' ? -pageWidth * 2 : 0}
                 max={component.type === 'price' || component.type === 'number' ? pageWidth * 2 : pageWidth * scaleFactor}
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
              {/* <InputGroup.Text>
                <i className='fas fa-arrow-left'></i>
              </InputGroup.Text> */}
              
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
              {/* <Button
                variant='outline-secondary'
                size='sm'
                onClick={() =>
                  movePosition(
                    component.type === 'price' || component.type === 'number'
                      ? 'left'
                      : 'right',
                    1
                  )
                }
              >
                <i className='fas fa-plus'></i>
              </Button>
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={() =>
                  movePosition(
                    component.type === 'price' || component.type === 'number'
                      ? 'right'
                      : 'left',
                    1
                  )
                }
              >
                <i className='fas fa-minus'></i>
              </Button> */}

            </InputGroup>
             
          </div>
        </div>

        {/* Slider pour ajustement fin */}
        {/* <div className='mt-3'>
          <Form.Label className='small'>
            <i className='fas fa-sliders-h me-1'></i>
            Ajustement fin
          </Form.Label>
          <Form.Range
            min={0}
            max={100}
            step={1}
            value={50}
            onChange={(e) => {
              const percentage = parseInt(e.target.value) / 100
              if (component.type === 'price' || component.type === 'number') {
                updateComponent({
                  bottom: percentage * pageHeight * scaleFactor,
                  right: 0,
                } as Partial<NumberComponentType | PrincipalPriceComponentType>)
              } else {
                updateComponent({
                  top: percentage * pageHeight * scaleFactor,
                  left: percentage * pageWidth * scaleFactor,
                } as Partial<TextComponentType>)
              }
            }}
            className='mt-1'
          />
        </div> */}
      </div>
    </div>
  )
}
