import { ComponentTypeMulti, NumberComponentType, PrincipalPriceComponentType, TextComponentType } from '@/types/ComponentType'
import React from 'react'
import { Form } from 'react-bootstrap'
import { FaArrowsLeftRight, FaArrowsUpDown, FaTextHeight } from 'react-icons/fa6'
interface CanvasEditorType {
    canvasData: ComponentTypeMulti[]
    setCanvasData: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>
    pageWidth: number
    pageHeight: number

}

export default function CanvasEditor({canvasEditorProps}: {canvasEditorProps :CanvasEditorType}) {

    const {canvasData, setCanvasData, pageWidth, pageHeight} = canvasEditorProps
console.log(pageWidth)
  return (
    <>
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

            const maxPreviewHeight = pageHeight < 100 ? 150 : 500 // en pixels
            const scaleFactor = maxPreviewHeight / pageHeight


          return (
            <React.Fragment key={index}>
              <Form.Group className='text-start mb-3' controlId='title'>
                <div className='d-flex align-items-center gap-2'>
                  <Form.Control
                    type='text'
                    placeholder='Entrez la valeur'
                    value={comp.text || ''}
                    onChange={(e) => {
                      const updatedCanvas = [...canvasData]
                      updatedCanvas[index] = {
                        ...updatedCanvas[index],
                        text: e.target.value,
                      }
                      setCanvasData(updatedCanvas)
                    }}
                  />
                  <i
                    className='fas fa-cog fs-5 cursor-pointer'
                    onClick={() => {
                      const updatedCanvas = [...canvasData]
                      updatedCanvas[index] = {
                        ...updatedCanvas[index],
                        showCustomValue: !updatedCanvas[index]?.showCustomValue,
                      }
                      setCanvasData(updatedCanvas)
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </Form.Group>
              {comp.showCustomValue && (
                <div className='custom-value d-flex gap-2 mb-3'>
                  {/* Size */}
                  <Form.Group className='text-center mb-3' controlId='fontSize'>
                    <Form.Label>
                      <FaTextHeight />
                    </Form.Label>
                    <div className='d-flex align-items-center gap-2'>
                      <Form.Range
                        min={10}
                        max={pageWidth * 2}
                        step={1}
                        value={comp.fontSize || 0}
                        onChange={(e) => {
                          const updatedCanvas = [...canvasData]
                          updatedCanvas[index] = {
                            ...updatedCanvas[index],
                            fontSize: parseInt(e.target.value) || 0,
                          }
                          setCanvasData(updatedCanvas)
                        }}
                      />
                    </div>
                  </Form.Group>
                  {/* Up/Down position */}
                  {comp.type !== 'price' && comp.type !== 'number' ? (
                    <Form.Group className='text-center mb-3' controlId='positionY'>
                      <Form.Label>
                        <FaArrowsUpDown />
                      </Form.Label>
                      <div className='d-flex align-items-center gap-2'>
                        <Form.Range
                          min={0}
                          max={pageHeight * scaleFactor}
                          // max={1000}
                          step={1}
                          value={comp.top || 0}
                          onChange={(e) => {
                            const updatedCanvas = [...canvasData]
                            updatedCanvas[index] = {
                              ...updatedCanvas[index],
                              top: parseInt(e.target.value) || 0,
                            }
                            setCanvasData(updatedCanvas)
                          }}
                        />
                      </div>
                    </Form.Group>
                  ) : (
                    <Form.Group className='text-center mb-3' controlId='positionY'>
                      <Form.Label>
                        <FaArrowsUpDown />
                      </Form.Label>
                      <div className='d-flex align-items-center gap-2'>
                        <Form.Range
                          min={0}
                          max={pageHeight * scaleFactor}
                          step={1}
                          value={comp.bottom || 0}
                          onChange={(e) => {
                            const updatedCanvas = [...canvasData]
                            updatedCanvas[index] = {
                              ...updatedCanvas[index],
                              bottom: parseInt(e.target.value) || 0,
                            }
                            setCanvasData(updatedCanvas)
                          }}
                        />
                      </div>
                    </Form.Group>
                  )}
                  {/* left/Right position */}
                  {comp.type !== 'price' && comp.type !== 'number' ? (
                    <Form.Group className='text-center mb-3' controlId='positionX'>
                      <Form.Label>
                        <FaArrowsLeftRight />
                      </Form.Label>
                      <div className='d-flex align-items-center gap-2'>
                        <Form.Range
                          min={0}
                          max={pageWidth * scaleFactor}
                          step={1}
                          value={comp.left || 0}
                          onChange={(e) => {
                            const updatedCanvas = [...canvasData]
                            updatedCanvas[index] = {
                              ...updatedCanvas[index],
                              left: parseInt(e.target.value) || 0,
                            }
                            setCanvasData(updatedCanvas)
                          }}
                        />
                      </div>
                    </Form.Group>
                  ) : (
                    <Form.Group className='text-center mb-3' controlId='positionX'>
                      <Form.Label>
                        <FaArrowsLeftRight  />
                      </Form.Label>
                      <div className='d-flex align-items-center gap-2'>
                        <Form.Range
                          min={-pageWidth * 2}
                          max={pageWidth * 2}
                          step={1}
                          value={comp.right || 0}
                          onChange={(e) => {
                            const updatedCanvas = [...canvasData]
                            updatedCanvas[index] = {
                              ...updatedCanvas[index],
                              right: parseInt(e.target.value) || 0,
                            }
                            setCanvasData(updatedCanvas)
                          }}
                        />
                      </div>
                    </Form.Group>
                  )}
                </div>
              )}
            </React.Fragment>
          )
        }
      })}
    </>

  )
}
