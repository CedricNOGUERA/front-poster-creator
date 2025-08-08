import dimensions from "@/mocks/dimensions.json";

// import pivotData from "@/mocks/model.json"; 
import useStoreApp from "@/stores/storeApp";
import { ComponentTypeMulti, NumberComponentType, TextComponentType, BackgroundComponentType, ImageComponentType, PrincipalPriceComponentType } from "@/types/ComponentType";
import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { _thousandSeparator } from "@/utils/functions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print'
import { _getModels } from "@/utils/apiFunctions";
import { ModelType } from "@/types/modelType";

export const GeneratorTemplate = () => {
  const storeApp = useStoreApp();

  const [canvasData, setCanvasData] = useState<ComponentTypeMulti[]>([]);
  const [models, setModels] = React.useState<ModelType[]>([])
  const [pageWidth, setPageWidth] = useState<number>(0); // en mm
  const [pageHeight, setPageHeight] = useState(0); // en mm

  const selectedDimension = useMemo(() => {
    return dimensions.find((d) => d.id === storeApp.dimensionId);
    setPageHeight(selectedDimension?.height ?? 0);
    setPageWidth(selectedDimension?.width ?? 0);
  }, [storeApp.dimensionId]);


  React.useEffect(() => {
    _getModels(setModels)
  }, [])

  React.useEffect(() => {
    // const selectedSchema = pivotData.find((p) => 
    const selectedSchema = models.find((p) => 
      p.dimensionId === storeApp.dimensionId && 
      p.templateId === storeApp.templateId &&
      p.categoryId === storeApp.categoryId
    );
    setCanvasData(selectedSchema?.canvas as ComponentTypeMulti[] ?? []);
    
  }, [storeApp, models])

  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: ${pageWidth}cm ${pageHeight}cm;
          margin: 0 !important;
          padding: 0 !important;
          position: absolute;
          top: 0 !important;
          left: 0 !important;
        }
      }
    `
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [pageWidth, pageHeight]);



  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    contentRef:  printRef,
    documentTitle: `bon-plan`,
  })

  if (!selectedDimension) return <p>Sélectionnez un format…</p>;

  const w = selectedDimension.width ;
  const h = selectedDimension.height;

  const maxPreviewHeight = 500; // en pixels
  const scaleFactor = maxPreviewHeight / h;

  const previewStyle: React.CSSProperties = {
    width: `${w  * scaleFactor}px`,
    height: `${h * scaleFactor}px`,
    border: canvasData?.length < 0 ? "2px dashed #ccc" : "none",
    position: "relative",
    background: "white",
    boxShadow: canvasData?.length < 0 ? "0 0 5px rgba(0,0,0,0.2)" : "none",
    margin: "auto",
  };
 console.log(models)

  const handleExportToPDF = async () => {
    const canvasElement: HTMLElement | null = document.getElementById('canvas')

    if (!canvasElement) {
      console.error('Canvas element not found!')
      return
    }

    // Store original style and temporarily remove border for capture
    const originalBorderStyle = canvasElement.style.border
    canvasElement.style.border = 'none'

    try {
      const scale = 2 // pour plus de netteté
      const canvas = await html2canvas(canvasElement, {
        scale: scale,
        useCORS: true,
      })

      const imageData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [selectedDimension.width ?? 300, selectedDimension.height ?? 300],
      })

      pdf.addImage(
        imageData,
        'PNG',
        0,
        0,
        selectedDimension.width ?? 300,
        selectedDimension.height ?? 300
      )
      pdf.save('design.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      // Restore the original border style ALWAYS
      canvasElement.style.border = originalBorderStyle
    }
  }
 


  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
        <div className='col-lg-9 d-flex flex-column justify-content-center align-items-center'>
          <h4>Aperçu</h4>
          <div className='canvas' ref={printRef} style={previewStyle}>
            {canvasData.map((comp: ComponentTypeMulti, index: number) => {
              if (comp.type === 'price') {
                const textComp = comp as PrincipalPriceComponentType

                const numberValue = parseInt(textComp.text.replace(/\D/g, ''), 10)
                const formattedNumber = !isNaN(numberValue)
                  ? _thousandSeparator(numberValue)
                  : textComp.text

                const baseFontSize = (textComp.fontSize ?? 16) * scaleFactor
                const numLength = formattedNumber.length
                let lengthAdjustmentFactor = 1
                let letterSpacing = 0.15
                if (numLength > 7) {
                  lengthAdjustmentFactor = 0.5
                  letterSpacing = 0.05
                } else if (numLength > 4) {
                  lengthAdjustmentFactor = 0.7
                  letterSpacing = 0.05
                }
                const adjustedFontSize = baseFontSize * lengthAdjustmentFactor

                return (
                  <div
                    key={index}
                    className={`absolute cursor-move pointer`}
                    style={{
                      position: 'absolute',
                      bottom: `${((textComp.bottom )?? 0) * scaleFactor }px`,
                      right: `0px`,
                      width: '100%',
                      height: 'auto',
                      fontSize: `${(adjustedFontSize)}px`,
                      fontWeight: textComp.fontWeight,
                      color: textComp.color,
                      wordBreak: 'break-word',
                      transform: `rotate(${textComp.rotation}deg)`,
                      padding: `0 ${10}px`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          textDecoration: textComp.textDecoration ?? 'none',
                          letterSpacing: `${letterSpacing}em`,
                        }}
                      >
                        {formattedNumber}
                      </span>
                      <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
                    </div>
                  </div>
                )
              }
              if (comp.type === 'number') {
                const textComp = comp as NumberComponentType

                const numberValue = parseInt(textComp.text.replace(/\D/g, ''), 10)
                const formattedNumber = !isNaN(numberValue)
                  ? _thousandSeparator(numberValue)
                  : textComp.text

                const baseFontSize = (textComp.fontSize ?? 16) * scaleFactor
                const numLength = formattedNumber.length
                let lengthAdjustmentFactor = 1
                if (numLength > 7) {
                  lengthAdjustmentFactor = 0.6
                } else if (numLength > 4) {
                  lengthAdjustmentFactor = 0.8
                }
                const adjustedFontSize = baseFontSize * lengthAdjustmentFactor

                return (
                  <div
                    key={index}
                    className={`absolute cursor-move pointer`}
                    style={{
                      position: 'absolute',
                      bottom: `${(textComp.bottom ?? 0) * scaleFactor}px`,
                      right: `${(textComp.right ?? 0) * scaleFactor}px`,
                      minWidth: `${20 * scaleFactor}px`,
                      minHeight: `${10 * scaleFactor}px`,
                      fontSize: `${adjustedFontSize}px`,
                      fontWeight: textComp.fontWeight,
                      color: textComp.color,
                      wordBreak: 'break-word',
                      transform: `rotate(${textComp.rotation}deg)`,
                      padding: `0 ${5 * scaleFactor}px`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ textDecoration: textComp.textDecoration ?? 'none' }}>
                        {formattedNumber}
                      </span>
                      <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
                    </div>
                  </div>
                )
              }
              if (comp.type === 'text' || comp.type === 'enableText') {
                const textComp = comp as TextComponentType
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move pointer text-end`}
                    style={{
                      position: 'absolute',
                      top: `${(textComp.top ?? 0) * scaleFactor}px`,
                      left: `${(textComp.left ?? 0) * scaleFactor}px`,
                      fontSize: `${(textComp.fontSize ?? 16) * scaleFactor}px`,
                      fontWeight: textComp.fontWeight,
                      color: textComp.color,
                      minWidth: `${20 * scaleFactor}px`,
                      minHeight: `${10 * scaleFactor}px`,
                      wordBreak: 'break-word',
                      transform: `rotate(${textComp.rotation}deg)`,
                      padding: `0 ${5 * scaleFactor}px`,
                    }}
                  >
                    {textComp.text}
                  </div>
                )
              }
              if (comp.type === 'background-color') {
                const bgComp = comp as BackgroundComponentType
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move`}
                    style={{
                      position: 'absolute',
                      top: `${(bgComp.top ?? 0) * scaleFactor}px`,
                      left: `${(bgComp.left ?? 0) * scaleFactor}px`,
                      width: `${(bgComp.width ?? 0) * scaleFactor}px`,
                      height: `${(bgComp.height ?? 0) * scaleFactor}px`,
                      backgroundColor: bgComp['backgroundColor'],
                    }}
                  ></div>
                )
              }
              if (comp.type === 'image') {
                const imgComp = comp as ImageComponentType
                return (
                  <div
                    key={index}
                    className={`absolute cursor-move`}
                    style={{
                      position: 'absolute',
                      top: `${(imgComp.top ?? 0) * scaleFactor}px`,
                      left: `${(imgComp.left ?? 0) * scaleFactor}px`,
                      width: `${(imgComp.width ?? 0) * scaleFactor}px`,
                      // height: `${(imgComp.height ?? 0) * scaleFactor}px`,
                    }}
                  >
                    <img
                      src={imgComp?.src ?? ''}
                      alt={imgComp?.src ?? ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
        <div className='col-lg-3 p-4'>
          <h4>Formulaire</h4>
          {canvasData.map((comp: ComponentTypeMulti, index: number) => {
            if (comp.type === 'text' || comp.type === 'number' || comp.type === 'price') {
              const textComp = comp as
                | TextComponentType
                | NumberComponentType
                | PrincipalPriceComponentType
              return (
                <Form.Group key={index} className='text-startmb-3' controlId='title'>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Entrez le titre'
                    value={textComp.text || ''}
                    onChange={(e) => {
                      const updatedCanvas = [...canvasData]
                      updatedCanvas[index] = {
                        ...updatedCanvas[index],
                        text: e.target.value,
                      }
                      setCanvasData(updatedCanvas)
                    }}
                  />
                </Form.Group>
              )
            }
          })}
          <Button variant='warning' onClick={() => handlePrint()} className='mt-4 me-4'>
            Imprimer
          </Button>
          <Button variant='primary' onClick={handleExportToPDF} className='mt-4'>
            Exporter en PDF
          </Button>
        </div>
      </div>
    </div>
  )
};
