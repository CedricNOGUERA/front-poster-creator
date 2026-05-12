/* eslint-disable react-hooks/exhaustive-deps */
import dimensions from '@/data/dimensions.json'
import useStoreApp from '@/stores/storeApp'
import {
  ComponentTypeMulti
} from '@/types/ComponentType'
import { ModelType } from '@/types/modelType'
import { _getModels, 
   _getTemplateById } from '@/utils/apiFunctions'

import React, { useRef, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import UpdateModel from '../UpdateModel'
import userDataStore from '@/stores/userDataStore'
import CanvasEditorImproved from '../editorTemplateComponent/CanvasEditorImproved'
import PrintOptionsModal from '../PrintOptionsModal'
import PictureAdder from '../editorTemplateComponent/PictureAdder'
import { TemplateType } from '@/types/TemplatesType'
import { _renderCanvasDisplay } from '@/utils/utils'

export const EditorTemplate = () => {
  /* States / Hooks
   *******************************************************************************************/
  const storeApp = useStoreApp()
  const adminRole = userDataStore((state) => state.role) === 'admin'
  const superAdminRole = userDataStore((state) => state.role) === 'super_admin'
  const printRef = useRef(null)
  const [canvasData, setCanvasData] = useState<ComponentTypeMulti[]>([])
  const [currentTemplate, setCurrentTemplate] = React.useState<TemplateType>({} as TemplateType)
  const [models, setModels] = React.useState<ModelType[]>([])
  const [modelId, setModelId] = useState<number>(0)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [selectedGarantie, setSelectedGarantie] = useState<string>("aucune");
  const [showGarantieSettings, setShowGarantieSettings] = useState(false);
  const [garantieImageParams, setGarantieImageParams] = useState({
    width: 80,
    top: 0,
    left: 0,
  });

  
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({
    width: '100%',
    height: '100%',
    border: '2px dashed #ccc',
    position: 'relative',
    background: 'white',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    margin: 'auto',
  })
  
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  
  /* UseEffect
  *******************************************************************************************/
 React.useEffect(() => {
   const init = async () => {
     await getCanvasData()
     await getPageDimensions()
     await setPageForPrint()
     await setPageForPreview()
     await _getTemplateById(setCurrentTemplate, storeApp.templateId)
    }
    init()
  }, [storeApp, storeApp.dimensionId, pageWidth, pageHeight, models])

  React.useEffect(() => {
    _getModels(setModels)
  }, [])
  
  /* Functions
  *******************************************************************************************/
 const getCanvasData = async () => {
    const selectedSchema = models.find(
      (p) =>
        p.dimensionId === storeApp.dimensionId &&
        p.templateId === storeApp.templateId &&
        p.categoryId === storeApp.categoryId
    )
    
    setCanvasData(selectedSchema?.canvas as ComponentTypeMulti[])
    setModelId(selectedSchema?.id ?? 0)
  }
  
  const getPageDimensions = async () => {
    const selectedDimension = dimensions.find((d) => d.id === storeApp.dimensionId)
    setPageHeight(selectedDimension?.height ?? 0)
    setPageWidth(selectedDimension?.width ?? 0)
  }

  const setPageForPrint = async () => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        @page {
            size: ${pageWidth} ${pageHeight};
            margin: 0 !important;
            padding: 0 !important;
            position: absolute;
            top: 0 !important;
            left: 0 !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }

  const setPageForPreview = async () => {
    const maxPreviewHeight = pageHeight < 98 ? 150 : 500 // en pixels
    const scaleFactor = maxPreviewHeight / pageHeight

    setPreviewStyle({
      width: `${pageWidth * scaleFactor}px`,
      height: `${pageHeight * scaleFactor}px`,
      border: canvasData?.length < 0 ? '2px dashed #ccc' : 'none',
      position: 'relative',
      background: 'white',
      boxShadow: canvasData?.length < 0 ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
      margin: 'auto',
    })
  }



  const updateModelProps = {
    canvasData, setIsUpdating, previewStyle, modelId, setModels
  }

  const API_URL = import.meta.env.VITE_API_URL


  const canvasDisplay = _renderCanvasDisplay(canvasData, API_URL)

  const canvasEditorProps = {canvasData, setCanvasData, pageWidth, pageHeight} 
  const warrantyPictureProps = {
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
    // setGarantieSrc,
  }

  /* Render
   *******************************************************************************************/
  return (
    <>
      {!isUpdating ? (
        <Container fluid className='bg-light px-0 height-container'>
          <Row className='gx-0 d-flex h-100'>
            <Col
              xs={9}
              className='d-flex flex-column justify-content-center align-items-center p-4 bg-body-secondary'
            >
              <h4>Aperçu</h4>
              <small>Modèle : #{modelId}</small>
              <div id='canvas' className='canvas mt-4' ref={printRef} style={previewStyle}>
                {canvasDisplay}
              </div>
            </Col>
            <Col xs={3} className='bg-white border-start border-bottom p-4 d-flex flex-column' style={{ height: '100vh', overflowY: 'auto' }}>
              <h4 className='mb-4'>Formulaire d'édition</h4>
              <div className='flex-grow-1'>
                <CanvasEditorImproved canvasEditorProps={canvasEditorProps} />
                  <PictureAdder warrantyPictureProps={warrantyPictureProps} />
              </div>
              <Container className='d-flex flex-column flex-xl-row justify-content-between align-items-center mt-4'>
                {adminRole ||
                  (superAdminRole && (
                    <Button
                      variant='outline-secondary'
                      onClick={() => setIsUpdating(true)}
                      className='mt-4 me-2'
                    >
                      Modifier le modèle
                    </Button>
                  ))}
                
                <Button variant='info' onClick={() => setShowPrintOptions(true)} className='text-muted mt-4'>
                  Options d'impression
                </Button>
              </Container>
            </Col>
          </Row>
        </Container>
      ) : (
        <UpdateModel updateModelProps={updateModelProps} />
      )}
      <PrintOptionsModal
        show={showPrintOptions}
        onHide={() => setShowPrintOptions(false)}
        templateState={{
          width: pageWidth,
          height: pageHeight,
          idShop: storeApp.shopId,
          idCategory: storeApp.categoryId
        }}
        canvasRef={printRef}
        templateName={currentTemplate.name}
      />
    </>
  )
}
