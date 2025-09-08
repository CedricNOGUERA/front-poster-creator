import React, { useState } from 'react'
import {
  BackgroundComponentType,
  ImageComponentType,
  ComponentTypeMulti,
  TextComponentType,
  NumberComponentType,
  PrincipalPriceComponentType,
  HeaderComponentType,
} from '@/types/ComponentType'
import useStoreApp from '@/stores/storeApp'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import dimensions from '@/mocks/dimensions.json'
import { FeedBackSatateType, NewTemplateType, ToastDataType } from '@/types/DiversType'
import {
  _generateInitalComponent,
  _handleDeleteComponent,
  _handleDragOver,
  _handleExportToPDF,
} from '@/utils/functions'
import SideBar from '../DragDropComponents/SideBar'
import { DimensionType } from '@/types/DimensionType'
import { _getCategoryById } from '@/utils/apiFunctions'
import { useOutletContext } from 'react-router-dom'
import ComponentEditor from '../DragDropComponents/ComponentEditor'
import { ModalValidateModel } from '../ui/Modals'
import * as htmlToImage from 'html-to-image'
import modelsServiceInstance from '@/services/modelsServices'
import templatesServiceInstance from '@/services/TemplatesServices'
import { CategoriesType } from '@/types/CategoriesType'
import { TemplateType } from '@/types/TemplatesType'

interface ContextInlineDragDropEditorType {
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  toggleShow: () => void
  feedBackState: FeedBackSatateType
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
}

export default function InlineDragDropEditor() {
  /* States
   *******************************************************************************************/
  const { setToastData, toggleShow, setFeedBackState } =
    useOutletContext<ContextInlineDragDropEditorType>()

  const storeApp = useStoreApp()
  const [components, setComponents] = useState<ComponentTypeMulti[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedDimension, setSelectedDimension] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<CategoriesType>(
    {} as CategoriesType
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [dimensionFactor, setDimensionFactor] = useState<number | null>(null)
  const [copiedComponent, setCopiedComponent] = useState<ComponentTypeMulti>(
    {} as ComponentTypeMulti
  )
  const [imageName, setImageName] = React.useState<string>('')
  const [newTemplateState, setNewTemplateState] = React.useState<NewTemplateType>({
    idShop: undefined,
    idCategory: undefined,
    nameCategory: '',
    nameTemplate: '',
    width: 600,
    height: 600,
    orientation: '',
  })
  const h = newTemplateState.height && newTemplateState.height
  const maxPreviewHeight = h && h < 100 ? 150 : 500
  const posterRef = React.useRef<HTMLDivElement>(null)

  const [showValidateModel, setShowValidateModel] = React.useState<boolean>(false)
  const handleCloseValidateModel = () => setShowValidateModel(false)
  const handleShowValidateModel = () => setShowValidateModel(true)

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getCategoryById(storeApp?.categoryId, setSelectedCategory)
    setSelectedDimension(storeApp?.dimensionId || 0)
  }, [setToastData, storeApp?.canvasId, storeApp?.dimensionId, toggleShow])

  React.useEffect(() => {
    // copyPaste()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c') {
        // Copier : si un élément est sélectionné
        if (selectedIndex !== null && components[selectedIndex]) {
          setCopiedComponent({ ...components[selectedIndex] })
        }
      }

      if (e.ctrlKey && e.key === 'v') {
        // Coller
        if (copiedComponent) {
          const textComp = copiedComponent as TextComponentType
          const numberComp = copiedComponent as NumberComponentType
          const newComp = {
            ...copiedComponent,
            top: textComp.top !== undefined ? textComp.top + 10 : undefined,
            left: textComp.left !== undefined ? textComp.left + 10 : undefined,
            bottom: numberComp.bottom !== undefined ? numberComp.bottom : undefined,
            right: numberComp.right !== undefined ? numberComp.right : undefined,
          }

          setComponents((prev) => [...prev, newComp as ComponentTypeMulti])
          setSelectedIndex(components.length)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [components, selectedIndex, copiedComponent])

  React.useEffect(() => {
    _generateInitalComponent(
      selectedCategory.canvas,
      storeApp,
      newTemplateState,
      setNewTemplateState,
      maxPreviewHeight,
      h,
      components,
      setComponents,
      setDimensionFactor
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, storeApp, maxPreviewHeight, h])


  

  /* Functions
   *******************************************************************************************/

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('componentType')
    const src = e.dataTransfer.getData('componentSrc')

    const canvasElement = posterRef.current

    if (!canvasElement) {
      console.error(
        'Canvas ref (posterRef.current) is null in handleDrop. Drop will not be processed.'
      )
      return
    }

    const canvasRect = canvasElement.getBoundingClientRect()
    const left = e.clientX - canvasRect.left
    const top = e.clientY - canvasRect.top
    const right = type === 'price' ? 0 : canvasRect.width - left
    const bottom = canvasRect.height - top

    let newComponent: ComponentTypeMulti | ComponentTypeMulti[]

    if (type === 'group') {
      const offsetTop = top

      const multiTexts: ComponentTypeMulti[] = [
        {
          type: 'text',
          top: offsetTop + 0,
          left,
          text: 'Carton Cup Nouilles',
          fontSize: 19,
          fontWeight: 900,
          color: '#000000',
          rotation: 0,
        },
        {
          type: 'text',
          top: offsetTop + 24,
          left,
          text: 'NONGHIM',
          fontSize: 16,
          fontWeight: 900,
          color: '#000000',
          rotation: 0,
        },
        {
          type: 'text',
          top: offsetTop + 43,
          left,
          text: 'Boeuf',
          fontSize: 16,
          fontWeight: 700,
          color: '#000000',
          rotation: 0,
        },
        {
          type: 'text',
          top: offsetTop + 64,
          left: left - 2, // petite variation si tu veux
          text: '12x175g',
          fontSize: 16,
          fontWeight: 400,
          color: '#000000',
          rotation: 0,
        },
      ]

      setComponents((prev) => [...prev, ...multiTexts])
      setSelectedIndex(components.length)
      return
    }

    if (type === 'text') {
      newComponent = {
        type: 'text',
        top,
        left,
        text: 'Texte par défaut',
        fontSize: 16,
        fontWeight: 900,
        color: '#000000',
        rotation: 0,
      }
    } else if (type === 'enableText') {
      newComponent = {
        type: 'enableText',
        top,
        left,
        text: 'Texte qui ne change pas',
        fontSize: 16,
        fontWeight: 700,
        color: '#000000',
        rotation: 0,
      }
    } else if (type === 'number') {
      newComponent = {
        type: 'number',
        bottom,
        right,
        text: '1000',
        fontSize: 16,
        fontWeight: 700,
        color: '#000000',
        fontFamily: 'Impact',
        rotation: 0,
        textDecoration: 'none',
      } as NumberComponentType
    } else if (type === 'price') {
      newComponent = {
        type: 'price',
        bottom,
        right,
        width: 100,
        text: '1000',
        fontSize: 24,
        fontWeight: 1000,
        color: '#000000',
        fontFamily: 'Impact',
        rotation: 0,
        textDecoration: 'none',
      } as PrincipalPriceComponentType
    } else if (type === 'image') {
      newComponent = {
        type: 'image',
        top,
        left,
        width: 150,
        height: 'auto',
        src: src,
      }
    } else {
      console.error('Unknown component type dropped:', type)
      return
    }

    setComponents((prev: ComponentTypeMulti[]) => [
      ...prev,
      newComponent as ComponentTypeMulti,
    ])
    setSelectedIndex(components.length)
  }

  const handleDragOnCanvas = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLImageElement, MouseEvent>, index: number) => {
      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startY = e.clientY

      const comp = components[index] as ComponentTypeMulti
      // Initialiser les positions différemment selon le type
      let initialLeft: number | string = 0
      let initialTop: number | string = 0
      let initialRight = 0
      let initialBottom = 0

      if (comp.type === 'number') {
        const compNumber = comp as NumberComponentType
        initialRight = compNumber.right || 0
        initialBottom = compNumber.bottom || 0
      } else if (comp.type === 'price') {
        const compPrice = comp as PrincipalPriceComponentType
        initialRight = 0
        initialBottom = compPrice.bottom || 0
      } else {
        initialLeft = (comp as Exclude<ComponentTypeMulti, NumberComponentType>).left || 0
        initialTop = (comp as Exclude<ComponentTypeMulti, NumberComponentType>).top || 0
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX: number = moveEvent.clientX - startX
        const deltaY: number = moveEvent.clientY - startY

        if (comp.type === 'number' || comp.type === 'price') {
          const updatedComponents = [...components]

          updatedComponents[index] = {
            ...comp,
            right: comp.type === 'price' ? 0 : initialRight - deltaX,
            bottom: initialBottom - deltaY,
          }
          setComponents(updatedComponents)
        } else {
          const updatedComponents = [...components]

          updatedComponents[index] = {
            ...comp,
            left: initialLeft + deltaX,
            top: initialTop + deltaY,
          }
          setComponents(updatedComponents)
        }
      }

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [components]
  )

  const updateComponent = React.useCallback((updatedFields: Partial<ComponentTypeMulti>) => {
    if (selectedIndex === null) return

    setComponents((prevComponents) => {
      const updated = [...prevComponents]
      if (updated[selectedIndex]) {
        updated[selectedIndex] = {
          ...updated[selectedIndex],
          ...updatedFields,
        }
      }
      return updated
    })
  }, [selectedIndex, setComponents])

  const getStyleFromComponent = React.useCallback(
    (comp: ComponentTypeMulti, isSelected: boolean) => {
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        wordBreak: 'break-word',
      }

      switch (comp.type) {
        case 'price':
        case 'number':
          return {
            ...baseStyle,
            bottom: `${
              (comp as PrincipalPriceComponentType | NumberComponentType).bottom ?? 0
            }px`,
            right: `${
              (comp as PrincipalPriceComponentType | NumberComponentType).right ?? 0
            }px`,
            fontFamily: (comp as PrincipalPriceComponentType | NumberComponentType).fontFamily || 'arial',
            fontSize: (comp as PrincipalPriceComponentType | NumberComponentType).fontSize,
            fontWeight: (comp as PrincipalPriceComponentType | NumberComponentType).fontWeight,
            color: (comp as PrincipalPriceComponentType | NumberComponentType).color,
            width:
              comp.type === 'price'
                ? `${(comp as PrincipalPriceComponentType).width}%`
                : undefined,
            minWidth: '20px',
            minHeight: '10px',
            borderBottom: isSelected ? '1px gray dashed' : '',
            cursor: 'move',
          }
        case 'text':
        case 'enableText':
          return {
            ...baseStyle,
            top: `${(comp as TextComponentType).top ?? 0}px`,
            left: `${(comp as TextComponentType).left ?? 0}px`,
            fontFamily: 'Mulish',
            fontSize: (comp as TextComponentType).fontSize,
            fontWeight: (comp as TextComponentType).fontWeight,
            transform: `rotate(${(comp as TextComponentType).rotation ?? 0}deg)`,
            color: (comp as TextComponentType).color,
            minWidth: '20px',
            minHeight: '10px',
            borderBottom: isSelected ? '1px gray dashed' : '',
            cursor: 'move',
          }
        case 'background-color':
          return {
            ...baseStyle,
            top: `${(comp as BackgroundComponentType).top ?? 0}px`,
            left: `${(comp as BackgroundComponentType).left ?? 0}px`,
            width: (comp as BackgroundComponentType).width,
            height: (comp as BackgroundComponentType).height,
            backgroundColor: (comp as BackgroundComponentType).backgroundColor,
          }
        case 'header':
          return {
            ...baseStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: `${(comp as BackgroundComponentType).top ?? 0}px`,
            left: `${(comp as BackgroundComponentType).left ?? 0}px`,
            width: (comp as BackgroundComponentType).width,
            height: (comp as BackgroundComponentType).height,
            backgroundColor: (comp as BackgroundComponentType).backgroundColor,
            padding:
              newTemplateState?.width &&
              newTemplateState?.height &&
              newTemplateState?.width < newTemplateState?.height
                ? '5%'
                : '1%',
          }
        case 'image':
          return {
            ...baseStyle,
            top: `${(comp as ImageComponentType).top ?? 0}px`,
            left: `${(comp as ImageComponentType).left ?? 0}px`,
            width: `${(comp as ImageComponentType).width}px`,
            height: 'auto',
            border: isSelected ? '1px gray dashed' : '',
            cursor: 'move',
          }
        default:
          return baseStyle
      }
    },
    [newTemplateState?.width, newTemplateState?.height]
  )

  const addModel = async (name: string) => {
    const imageName = name + '.png'

    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Chargement',
    }))

    // Génère une image PNG depuis la div canvas
    // const canvasElement = document.getElementById('canvas')
    const canvasElement = posterRef.current
    // const canvasElement = document.getElementById('canvas')
    if (!canvasElement) return
    const blob = await htmlToImage.toBlob(canvasElement)

    if (!blob) {
      console.error("Erreur de génération de l'image")
      return
    }

    const newData = {
      image: imageName,
      categoryId: storeApp.categoryId,
      dimensionId: storeApp.dimensionId,
      canvas: components,
    }

    const newTemplate = {
      name: name,
      image: imageName,
      categoryId: storeApp.categoryId,
      shopIds: [storeApp.shopId],
    }

    const formData = new FormData()
    formData.append('image', blob, imageName)
    formData.append('data', JSON.stringify(newData))

    try {
      const responseModel = await modelsServiceInstance.postModel(formData)

      const responseTemplate = await templatesServiceInstance.postTemplate(newTemplate)

      if (responseModel.ok && responseTemplate.ok) {
        handleCloseValidateModel()
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Modèle ajouté avec succès !',
        })
        toggleShow()
        setImageName('')
      } else {
        const err = await responseModel.json()
        throw new Error(err?.error || 'Erreur serveur')
      }
    } catch (error) {
      console.error('Error adding model:', error)
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-check-circle',
        message: "Une erreur est survenue lors de l'ajout du modèle.",
      })
      toggleShow()
    } finally {
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
      }))
    }
  }
  /* UseMemo
   *******************************************************************************************/
  const renderedComponents = React.useMemo(() => {
    return components.map((comp, index) => {
      const isSelected = index === selectedIndex
      const isHovered = index === hoveredIndex
      const isEditing = index === editingIndex
      let commonProps

      if (comp.type === 'background-color' || comp.type === 'header') {
        commonProps = {
          className: `absolute cursor-move pointer`,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            setSelectedIndex(index)
            setEditingIndex(null)
          },
          onMouseEnter: () => setHoveredIndex(index),
          onMouseLeave: () => setHoveredIndex(null),
          style: getStyleFromComponent(comp, isSelected),
        }
      } else {
        commonProps = {
          className: `absolute cursor-move pointer`,
          onMouseDown: (e: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => {
            if (!isEditing) {
              handleDragOnCanvas(e, index)
            }
          },
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            setSelectedIndex(index)
            if (comp.type === 'text' || comp.type === 'enableText' || comp.type === 'number' || comp.type === 'price') {
              if (isEditing) {
                setEditingIndex(null)
              } else {
                setEditingIndex(index)
              }
            } else {
              setEditingIndex(null)
            }
          },
          onMouseEnter: () => setHoveredIndex(index),
          onMouseLeave: () => setHoveredIndex(null),
          style: getStyleFromComponent(comp, isSelected),
        }
      }

      const deleteButton = isHovered && !isEditing && (
        <Button
          variant='light'
          className='rounded-circle'
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            zIndex: 20,
            width: '20px',
            height: '20px',
            padding: '0',
            lineHeight: '1',
          }}
          onClick={(e) => {
            e.stopPropagation()
            _handleDeleteComponent(index, setComponents, setSelectedIndex)
          }}
          title='Supprimer'
        >
          <i className='fa-solid fa-xmark'></i>
        </Button>
      )

      if (comp.type === 'price' || comp.type === 'number') {
        const typedComp = comp as PrincipalPriceComponentType | NumberComponentType
        if (isEditing) {
          return (
            <foreignObject
              key={index}
              x={typedComp.right ? undefined : 0}
              y={typedComp.bottom ? undefined : 0}
              width={150}
              height={50}
              style={{
                ...getStyleFromComponent(comp, isSelected),
                border: '1px dashed blue',
                overflow: 'visible',
              }}
            >
              <input
                type='text'
                value={typedComp.text}
                onChange={(e) => updateComponent({ text: e.target.value })}
                onBlur={() => setEditingIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setEditingIndex(null)
                  }
                }}
                style={{
                  width: 'auto',
                  height: '100%',
                  fontSize: typedComp.fontSize,
                  fontWeight: typedComp.fontWeight,
                  color: typedComp.color,
                  fontFamily: typedComp.fontFamily || 'arial',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                }}
                autoFocus
              />
            </foreignObject>
          )
        }
        return (
          <div key={index} {...commonProps}>
            <div style={{ whiteSpace: 'nowrap' }}>
              <span style={{ textDecoration: typedComp.textDecoration ?? 'none'}}>
                {typedComp.text}
              </span>
              <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
            </div>
            {deleteButton}
          </div>
        )
      }

      if (comp.type === 'text' || comp.type === 'enableText') {
        const textComp = comp as TextComponentType
        if (isEditing) {
          return (
            <foreignObject
              key={index}
              x={textComp.left}
              y={textComp.top}
              width={150}
              height={50}
              style={{
                ...getStyleFromComponent(comp, isSelected),
                border: '1px dashed blue',
                overflow: 'visible',
              }}
            >
              <input
                type='text'
                value={textComp.text}
                onChange={(e) => updateComponent({ text: e.target.value })}
                onBlur={() => setEditingIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setEditingIndex(null)
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  fontSize: textComp.fontSize,
                  fontWeight: textComp.fontWeight,
                  color: textComp.color,
                  fontFamily: 'impact',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  transform: `rotate(${textComp.rotation ?? 0}deg)`,
                }}
                autoFocus
              />
            </foreignObject>
          )
        }
        return (
          <div key={index} {...commonProps}>
            {textComp.text}
            {deleteButton}
          </div>
        )
      }

      if (comp.type === 'background-color') {
        return <div key={index} {...commonProps}></div>
      }

      if (comp.type === 'header') {
        const headerComp = comp as HeaderComponentType
        return (
          <div key={index} {...commonProps}>
            <img
              src={headerComp.src ? headerComp.src : undefined}
              alt=''
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </div>
        )
      }

      if (comp.type === 'image') {
        const imgComp = comp as ImageComponentType
        return (
          <div key={index} {...commonProps}>
            <img
              src={imgComp.src ?? ''}
              alt=''
              width={imgComp.width}
              height={imgComp.height}
              style={{ width: '100%', height: '100%' }}
            />
            {deleteButton}
          </div>
        )
      }

      return null
    })
  }, [
    components,
    selectedIndex,
    hoveredIndex,
    editingIndex,
    handleDragOnCanvas,
    getStyleFromComponent,
    updateComponent,
  ])

  /* component props
   *******************************************************************************************/
  const ComponentEditorProps = { components, selectedIndex, updateComponent }
  const modalValidateModelProps = {
    showValidateModel,
    handleCloseValidateModel,
    addModel,
    imageName,
    setImageName,
    template: [] as TemplateType[],
    setTemplate: () => {},
    isErrorModel: false,
    hasModel: false,
  }

  /* render
   *******************************************************************************************/
  return (
    <Container fluid className='bg-light px-0'>
      <div className='d-flex h-screen '>
        {/* Drag 'n Drop éditeur  */}
        <SideBar storeApp={storeApp} selectedCanvas={selectedCategory.canvas} />
        {/* Canvas */}
        <div className='m-auto'>
          <Container className='px-5 mb-3'>
            <h4>Dimensions prédéfinies</h4>
            <Row className='text-start'>
              <Col xs={12}>
                <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                  {/* <Form.Label>Prédéfinies</Form.Label> */}
                  <Form.Select
                    value={selectedDimension || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const dimensionId = parseInt(e.target.value)
                      setSelectedDimension(dimensionId)
                      storeApp.setDimensionId(dimensionId)

                      const selectedDim = dimensions.find((d) => d.id === dimensionId)
                      if (selectedDim) {
                        setNewTemplateState((prev) => ({
                          ...prev,
                          width: selectedDim.width,
                          height: selectedDim.height,
                        }))
                      }
                    }}
                  >
                    <option value=''>Sélection une dimension</option>
                    {dimensions.map((dimension: DimensionType, index: number) => (
                      <option key={index} value={dimension.id}>
                        {dimension.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Container>
          <div
            id='canvas'
            ref={posterRef}
            className=' relative bg-gray-50 shadow m-auto m-4 canvas'
            onDrop={handleDrop}
            onDragOver={_handleDragOver}
            style={{
              width:
                newTemplateState?.width && dimensionFactor
                  ? `${newTemplateState.width * dimensionFactor}px`
                  : '500px',
              height: maxPreviewHeight ? `${maxPreviewHeight}px` : '500px',
            }}
          >
            {renderedComponents}
          </div>
          <div className='p-4 flex gap-2'>
            <Button
              variant='primary'
              onClick={() => _handleExportToPDF(newTemplateState)}
              className='me-4'
            >
              Exporter en PDF
            </Button>
            <Button
              variant='success'
              onClick={() => {
                handleShowValidateModel()
              }}
              className=''
            >
              Enregistrer
            </Button>
          </div>
        </div>
        {/* Éditeur dynamique */}
        <ComponentEditor ComponentEditorProps={ComponentEditorProps} />
      </div>

      <ModalValidateModel modalValidateModelProps={modalValidateModelProps} />
    </Container>
  )
}
