import {
  ComponentTypeMulti,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
} from '@/types/ComponentType'
import React from 'react'
import { Form, Card, Accordion } from 'react-bootstrap'
import PositionControls from './PositionControls'

interface CanvasEditorType {
  canvasData: ComponentTypeMulti[]
  setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>
  pageWidth: number
  pageHeight: number
}

export default function CanvasEditorImproved({
  canvasEditorProps,
}: {
  canvasEditorProps: CanvasEditorType
}) {
  const { canvasData, setCanvasData, pageWidth, pageHeight } = canvasEditorProps

  const maxPreviewHeight = pageHeight < 100 ? 150 : 500
  const scaleFactor = maxPreviewHeight / pageHeight

  const updateComponent = (index: number, updates: Partial<ComponentTypeMulti>) => {
    const updatedCanvas = [...canvasData]
    updatedCanvas[index] = {
      ...updatedCanvas[index],
      ...updates,
    }
    setCanvasData(updatedCanvas)
  }

  const toggleCustomValue = (index: number) => {
    updateComponent(index, {
      showCustomValue: !canvasData[index]?.showCustomValue,
    })
  }

  return (
    <div className='canvas-editor-improved'>
      {canvasData?.map((component: ComponentTypeMulti, index: number) => {
        if (
          component.type === 'text' ||
          component.type === 'number' ||
          component.type === 'price'
        ) {
          const comp = component as
            | TextComponentType
            | NumberComponentType
            | PrincipalPriceComponentType

          return (
            <Card key={index} className='mb-2 shadow-sm'>
              <Card.Header className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center gap-2'>
                  <i
                    className={`fas ${
                      comp.type === 'text'
                        ? 'fa-font'
                        : comp.type === 'number'
                        ? 'fa-hashtag'
                        : 'fa-euro-sign'
                    } text-primary`}
                  ></i>
                  <span className='fw-bold text-capitalize'>
                    {comp.type === 'text'
                      ? 'Texte'
                      : comp.type === 'number'
                      ? 'Nombre'
                      : 'Prix'}
                  </span>
                </div>
                <div className='d-flex gap-2'>
                  <Form.Check
                    type='switch'
                    id={`toggle-${index}`}
                    // label="Personnaliser"
                    checked={comp.showCustomValue || false}
                    onChange={() => toggleCustomValue(index)}
                  />
                  <i
                    className='fas fa-cog fs-5 cursor-pointer text-muted'
                    onClick={() => toggleCustomValue(index)}
                    style={{ cursor: 'pointer' }}
                    title='Paramètres avancés'
                  />
                </div>
              </Card.Header>
              <Card.Body>
                {/* Contrôle du texte */}
                <Form.Group className='mb-'>
                  <Form.Control
                    type='text'
                    placeholder='Entrez la valeur'
                    value={comp.text || ''}
                    onChange={(e) => updateComponent(index, { text: e.target.value })}
                    className='border-secondary'
                  />
                </Form.Group>

                {/* Paramètres avancés */}
                {comp.showCustomValue && (
                  <Accordion defaultActiveKey='0' className='mt-3'>
                    {/* Taille de police */}
                    <Accordion.Item eventKey='0'>
                      <Accordion.Header>
                        <i className='fas fa-text-height me-2'></i>
                        Taille de police
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className='d-flex align-items-center gap-3'>
                          <Form.Label className='small mb-0'>
                            <i className='fas fa-minus'></i>
                          </Form.Label>
                          <Form.Range
                            min={10}
                            max={pageWidth * 2}
                            step={1}
                            value={comp.fontSize || 0}
                            onChange={(e) =>
                              updateComponent(index, {
                                fontSize: parseInt(e.target.value) || 0,
                              })
                            }
                            className='flex-grow-1'
                          />
                          <Form.Label className='small mb-0'>
                            <i className='fas fa-plus'></i>
                          </Form.Label>
                          <Form.Control
                            type='number'
                            min={10}
                            max={pageWidth * 2}
                            value={comp.fontSize || 0}
                            onChange={(e) =>
                              updateComponent(index, {
                                fontSize: parseInt(e.target.value) || 0,
                              })
                            }
                            style={{ width: '80px' }}
                            size='sm'
                          />
                        </div>
                        <div className='text-center mt-2'>
                          <small className='text-muted'>Taille: {comp.fontSize || 0}px</small>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Position */}
                    <Accordion.Item eventKey='1'>
                      <Accordion.Header>
                        <i className='fas fa-arrows-alt me-2'></i>
                        Position
                      </Accordion.Header>
                      <Accordion.Body>
                        <PositionControls
                          component={comp}
                          index={index}
                          canvasData={canvasData}
                          setCanvasData={setCanvasData}
                          pageWidth={pageWidth}
                          pageHeight={pageHeight}
                          scaleFactor={scaleFactor}
                        />
                      </Accordion.Body>
                    </Accordion.Item>

                  </Accordion>
                )}
              </Card.Body>
            </Card>
          )
        }
        return null
      })}
    </div>
  )
}
