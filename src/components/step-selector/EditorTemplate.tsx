/* eslint-disable react-hooks/exhaustive-deps */
import dimensions from '@/mocks/dimensions.json'
import useStoreApp from '@/stores/storeApp'
import {
  BackgroundComponentType,
  ComponentTypeMulti,
  HeaderComponentType,
  HorizontalLineComponentType,
  ImageComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
  TextComponentType,
  VerticalLineComponentType,
} from '@/types/ComponentType'
import { ModelType } from '@/types/modelType'
import { _getModels } from '@/utils/apiFunctions'
import { _thousandSeparator } from '@/utils/functions'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useRef, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import UpdateModel from '../UpdateModel'
import userDataStore from '@/stores/userDataStore'
// import CanvasEditor from '../editorTemplateComponent/CanvasEditor'
// import WarrantyPicture from '../editorTemplateComponent/WarrantyPicture'
import CanvasEditorImproved from '../editorTemplateComponent/CanvasEditorImproved'
import PictureAdder from '../editorTemplateComponent/PictureAdder'

export const EditorTemplate = () => {
  /* States / Hooks
   *******************************************************************************************/
  const storeApp = useStoreApp()
  const adminRole = userDataStore((state) => state.role) === 'admin'
  const superAdminRole = userDataStore((state) => state.role) === 'super_admin'
  const printRef = useRef(null)
  const [canvasData, setCanvasData] = useState<ComponentTypeMulti[]>([])
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

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    const init = async () => {
      await getCanvasData()
      await getPageDimensions()
      await setPageForPrint()
      await setPageForPreview()
    }
    init()
  }, [storeApp, storeApp.dimensionId, pageWidth, pageHeight, models])

  React.useEffect(() => {
    _getModels(setModels)
  }, [])

  React.useEffect(() => {
    // Ne rien faire si aucune garantie sélectionnée
    if (!selectedGarantie || selectedGarantie === "aucune") {
      setCanvasData((prev) =>
        Array.isArray(prev)
          ? prev.filter(
              (comp) =>
                !(
                  comp.type === "image" &&
                  "src" in comp &&
                  typeof comp.src === "string" &&
                  comp.src.includes("garantie-")
                )
            )
          : []
      );
      return;
    }

    // Détermine l'URL de l'image selon la garantie sélectionnée
    let garantieSrc = ''
    if (selectedGarantie === '6mois') {
      garantieSrc = '/uploads/garantie-6-mois.png'
    } else if (selectedGarantie === '1an') {
      garantieSrc = '/uploads/garantie-1-an.png'
    } else if (selectedGarantie === '2ans') {
      garantieSrc = '/uploads/garantie-2-ans.png'
    }

    const garantieComponent = {
      type: "image",
      top: garantieImageParams.top,
      left: garantieImageParams.left,
      width: garantieImageParams.width,
      height: "auto",
      src: garantieSrc,
    };

    setCanvasData((prev) => {
      const filtered = Array.isArray(prev)
        ? prev.filter(
            (comp) =>
              !(
                comp.type === "image" &&
                "src" in comp &&
                typeof comp.src === "string" &&
                comp.src.includes("garantie-")
              )
          )
        : [];
      return garantieSrc ? [...filtered, garantieComponent] : filtered;
    });
  }, [garantieImageParams, selectedGarantie]);

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
    const maxPreviewHeight = pageHeight < 100 ? 150 : 500 // en pixels
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

  const handleExportToPDF = async () => {
    if (!printRef.current) return

    try {
      // Capture le contenu de l'aperçu avec une meilleure résolution
      const canvas = await html2canvas(printRef.current, {
        scale: 4, // Augmente significativement la qualité
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: false,
      })

      // Crée un nouveau PDF avec les dimensions en millimètres
      const pdf = new jsPDF({
        orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pageHeight, pageWidth],
      })

      // Convertit le canvas en image et l'ajoute au PDF
      const imgData = canvas.toDataURL('image/png', 1.0) // Qualité maximale
      const imgWidth = pageWidth
      const imgHeight = pageHeight

      // Ajoute l'image au PDF avec les dimensions exactes
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      // pdf.save(template?.templateId?.name + ".pdf");
      pdf.save('document.pdf')
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  const updateModelProps = {
    canvasData, setIsUpdating, previewStyle, modelId, setModels
  }

  const API_URL = import.meta.env.VITE_API_URL

  const sanitizeHTML = (html: string): string => {
    if (!html) return ''
    
    // Liste des balises autorisées
    const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'sup', 'sub', 'br', 'span', 'div', 'p']
    
    // Créer un élément temporaire pour parser le HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    
    // Fonction récursive pour nettoyer les nœuds
    const cleanNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || ''
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        const tagName = element.tagName.toLowerCase()
        
        // Si la balise n'est pas autorisée, retourner seulement le texte
        if (!allowedTags.includes(tagName)) {
          return element.textContent || ''
        }
        
        // Récupérer les attributs de style autorisés
        const allowedAttributes = ['style', 'class']
        const attributes = Array.from(element.attributes)
          .filter(attr => allowedAttributes.includes(attr.name))
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ')
        
        // Construire la balise ouvrante
        const openTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`
        
        // Traiter les enfants
        let innerHTML = ''
        for (const child of Array.from(element.childNodes)) {
          innerHTML += cleanNode(child)
        }
        
        // Retourner la balise complète
        return `${openTag}${innerHTML}</${tagName}>`
      }
      
      return ''
    }
    
    // Nettoyer tous les nœuds
    let cleanedHTML = ''
    for (const child of Array.from(tempDiv.childNodes)) {
      cleanedHTML += cleanNode(child)
    }
    
    return cleanedHTML
  }

  const canvasDisplay = canvasData?.map((component: ComponentTypeMulti, index: number) => {
    if (component.type === 'price') {
      const priceComp = component as PrincipalPriceComponentType
      const numberValue = parseInt(priceComp?.text.replace(/\D/g, ''), 10)
      const formattedNumber = !isNaN(numberValue)
        ? _thousandSeparator(numberValue)
        : priceComp?.text

      return (
        <div
          key={index}
          className={`absolute cursor-move pointer`}
          style={{
            position: 'absolute',
            bottom: `${priceComp?.bottom ?? 0}px`,
            right: `${priceComp?.right ?? 0}px`,
            height: 'auto',
            fontFamily: priceComp?.fontFamily,
            fontSize: `${priceComp?.fontSize}px`,
            fontWeight: priceComp?.fontWeight,
            color: priceComp?.color,
            wordBreak: 'break-word',
            transform: `rotate(${priceComp?.rotation}deg)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <span
              style={{
                textDecoration: priceComp?.textDecoration ?? 'none',
              }}
            >
              {formattedNumber}
            </span>
            <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
          </div>
        </div>
      )
    }
    if (component.type === 'number') {
    
      const numberComp = component as NumberComponentType
      const numberValue = parseInt(numberComp.text.replace(/\D/g, ''), 10)
      const formattedNumber = !isNaN(numberValue)
        ? _thousandSeparator(numberValue)
        : numberComp.text
      return (
        <div
          key={index}
          className={`absolute cursor-move pointer`}
          style={{
            position: 'absolute',
            bottom: `${numberComp.bottom ?? 0}px`,
            right: `${numberComp.right ?? 0}px`,
            minWidth: `${20}px`,
            minHeight: `${10}px`,
            fontFamily: numberComp?.fontFamily,
            fontSize: numberComp?.fontSize,
            fontWeight: numberComp.fontWeight,
            color: numberComp.color,
            wordBreak: 'break-word',
            transform: `rotate(${numberComp.rotation}deg)`,
            padding: `0 ${5}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <span
              style={{
                textDecoration: numberComp.textDecoration ?? 'none',
              }}
            >
              {formattedNumber}
            </span>
            <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
          </div>
        </div>
      )
    }
    if (component.type === 'text') {
      const textComp = component as TextComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move pointer text-end`}
          style={{
            position: 'absolute',
            top: `${textComp?.top ?? 0}px`,
            left: `${textComp?.left ?? 0}px`,
            fontSize: `${textComp?.fontSize ?? 16}px`,
            fontWeight: textComp?.fontWeight,
            color: textComp?.color,
            minWidth: `${20}px`,
            minHeight: `${10}px`,
            wordBreak: 'break-word',
            transform: `rotate(${textComp?.rotation}deg)`,
            padding: `0 ${5}px`,
            fontFamily: textComp.fontFamily,
            textDecoration: textComp.textDecoration ?? 'none'
          }}
        >
          {textComp?.text}
        </div>
      )
    }
    if (component.type === 'enableText') {
      const textComp = component as TextComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move pointer text-end`}
          style={{
            position: 'absolute',
            top: `${textComp?.top ?? 0}px`,
            left: `${textComp?.left ?? 0}px`,
            fontSize: `${textComp?.fontSize ?? 16}px`,
            fontWeight: textComp?.fontWeight,
            color: textComp?.color,
            minWidth: `${20}px`,
            minHeight: `${10}px`,
            wordBreak: 'break-word',
            transform: `rotate(${textComp?.rotation}deg)`,
            padding: `0 ${5}px`,
            fontFamily: textComp.fontFamily,
            textDecoration: textComp.textDecoration ?? 'none'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(textComp?.text || '') }} />
        </div>
      )
    }
    if (component.type === 'background-color') {
      const bgComp = component as BackgroundComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move`}
          style={{
            position: 'absolute',
            top: `${bgComp.top ?? 0}px`,
            left: `${bgComp.left ?? 0}px`,
            width: `${bgComp.width ?? 0}px`,
            height: `${bgComp.height ?? 0}px`,
            backgroundColor: bgComp.backgroundColor,
          }}
        ></div>
      )
    }
    if (component.type === 'header') {
      const headerComp = component as HeaderComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move`}
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: `${headerComp.top ?? 0}px`,
            left: `${headerComp.left ?? 0}px`,
            width: `${headerComp.width ?? 0}px`,
            height: `${headerComp.height ?? 0}px`,
            backgroundColor: headerComp.backgroundColor,
            padding:
              headerComp?.width &&
              headerComp?.height &&
              headerComp?.width > headerComp?.height
                ? '5%'
                : '1%',
          }}
        >
          <img
            src={headerComp.src ? API_URL + headerComp.src : undefined}
            alt=''
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      )
    }
    if (component.type === 'image') {
      const imgComp = component as ImageComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move`}
          style={{
            position: 'absolute',
            top: `${imgComp.top ?? 0}px`,
            left: `${imgComp.left ?? 0}px`,
          }}
        >
          <img
            src={imgComp?.src ? API_URL + imgComp?.src : ''}
            alt={imgComp?.src ?? ''}
            style={{
              width: `${imgComp.width ?? 0}px`,
              height: `auto`,
              objectFit: 'contain',
            }}
          />
        </div>
      )
    }
    if (component.type === 'horizontalLine') {
      const horizontalComp = component as HorizontalLineComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move`}
          style={{
            position: 'absolute',
            top: `${horizontalComp.top ?? 0}px`,
            left: `${horizontalComp.left ?? 0}px`,
            width: `${horizontalComp.width ?? 0}px`,
            height: `${horizontalComp.thickness ?? 0}px`,
            backgroundColor: horizontalComp.color,
          }}
        ></div>
      )
    }
    if (component.type === 'verticalLine') {
      const verticalComp = component as VerticalLineComponentType
      return (
        <div
          key={index}
          className={`absolute cursor-move`}
          style={{
            position: 'absolute',
            top: `${verticalComp.top ?? 0}px`,
            left: `${verticalComp.left ?? 0}px`,
            width: `${verticalComp.thickness ?? 0}px`,
            height: `${verticalComp.height ?? 0}px`,
            backgroundColor: verticalComp.color,
          }}
        ></div>
      )
    }
    return null
  })

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
                {/* <CanvasEditor canvasEditorProps={canvasEditorProps} /> */}
                {/*{storeApp.categoryId === 2 && storeApp.shopId === 2 && (*/}
                  {/* <WarrantyPicture warrantyPictureProps={warrantyPictureProps} /> */}
                  <PictureAdder warrantyPictureProps={warrantyPictureProps} />
                {/* // )} */}
              </div>
              <Container className='d-flex flex-md-column flex-lg-row justify-content-between align-items-center mt-4'>
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
                <Button variant='primary' onClick={handleExportToPDF} className='mt-4'>
                  Génerer le PDF
                </Button>
              </Container>
            </Col>
          </Row>
        </Container>
      ) : (
        <UpdateModel updateModelProps={updateModelProps} />
      )}
    </>
  )
}
