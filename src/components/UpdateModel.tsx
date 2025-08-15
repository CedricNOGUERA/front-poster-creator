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
import { Button, Container } from 'react-bootstrap'
import dimensions from '@/mocks/dimensions.json'
import { FeedBackSatateType, NewTemplateType, ToastDataType } from '@/types/DiversType'
import {
  _generateInitalComponent,
  _handleDeleteComponent,
  _handleDragOver,
  _handleExportToPDF,
  _thousandSeparator,
} from '@/utils/functions'
import SideBar from './DragDropComponents/SideBar'
import { _getCategoryById, _getModels } from '@/utils/apiFunctions'
import { useOutletContext } from 'react-router-dom'
import ComponentEditor from './DragDropComponents/ComponentEditor'
import { ModalUpdateModel } from './ui/Modals'
import modelsServiceInstance from '@/services/modelsServices'
import { CategoriesType } from '@/types/CategoriesType'
import { ModelType } from '@/types/modelType'

interface ContextInlineDragDropEditorType {
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  toggleShow: () => void
  feedBackState: FeedBackSatateType
}

interface UpdateModelPropsType {
    canvasData: ComponentTypeMulti[]
    setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
    previewStyle: React.CSSProperties
    modelId: number
    setModels: React.Dispatch<React.SetStateAction<ModelType[]>>
}

export default function UpdateModel({updateModelProps}: {updateModelProps: UpdateModelPropsType}) {
  /* Props
   *******************************************************************************************/
  const { canvasData, setIsUpdating, previewStyle, modelId, setModels } = updateModelProps

  /* States
   *******************************************************************************************/
  const API_URL = import.meta.env.VITE_API_URL
  const { setToastData, toggleShow } =
    useOutletContext<ContextInlineDragDropEditorType>()

    const prevWidth = parseInt(((previewStyle?.width)as string)?.slice(0,-2))
    const prevHeight = parseInt(((previewStyle?.height)as string)?.slice(0,-2))

  const storeApp = useStoreApp()
  const idTemplate = storeApp.templateId
  const [components, setComponents] = useState<ComponentTypeMulti[]>(canvasData || [])
  // const [components, setComponents] = useState<ComponentTypeMulti[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedDimension, setSelectedDimension] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<CategoriesType>(
    {} as CategoriesType
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [copiedComponent, setCopiedComponent] = useState<ComponentTypeMulti>(
    {} as ComponentTypeMulti
  )
  const [dimensionFactor, setDimensionFactor] = useState<number | null>(null)
  const [imageName, setImageName] = React.useState<string>('')
  const [newTemplateState, setNewTemplateState] = React.useState<NewTemplateType>({
    idShop: undefined,
    idCategory: undefined,
    nameCategory: '',
    nameTemplate: '',
    width: previewStyle?.width ? prevWidth : 600,
    height: previewStyle?.height ? prevHeight : 600,
    orientation: '',
  })
  const selectedDim = dimensions.find((d) => d.id === selectedDimension)
  // const h = newTemplateState.height && newTemplateState.height
  const h = selectedDim?.height && selectedDim?.height
  const maxPreviewHeight = h && h < 100 ? 150 : 500
  const posterRef = React.useRef<HTMLDivElement>(null)



  const [showUpdateModel, setShowUpdateModel] = React.useState<boolean>(false)
  const handleCloseUpdateModel = () => {
    setImageName("")
    setShowUpdateModel(false)
  }
  const handleShowUpdateModel = () => setShowUpdateModel(true)

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
    const right = canvasRect.width - left
    // const right = type === 'price' ? 0 : canvasRect.width - left
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
          fontFamily: 'Mulish',
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
          fontFamily: 'Mulish',
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
          fontFamily: 'Mulish',
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
          fontFamily: 'Mulish',
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
        fontFamily: 'Mulish',
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
        fontFamily: 'Mulish',
        fontSize: 16,
        fontWeight: 700,
        color: '#000000',
        rotation: 0,
        textDecoration: 'none',
      }
    } else if (type === 'price') {
      newComponent = {
        type: 'price',
        bottom,
        right,
        width: 100,
        text: '1000',
        fontFamily: 'Impact',
        fontSize: 50,
        fontWeight: 1000,
        color: '#000000',
        rotation: 0,
        textDecoration: 'none',
      }
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
        initialRight = compPrice.right || 0
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
            right: initialRight - deltaX,
            // right: comp.type === 'price' ? 0 : initialRight - deltaX,
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
            fontFamily:  (comp as PrincipalPriceComponentType | NumberComponentType).fontFamily || 'Impact',
            fontSize: (comp as PrincipalPriceComponentType | NumberComponentType).fontSize,
            fontWeight: (comp as PrincipalPriceComponentType | NumberComponentType).fontWeight,
            color: (comp as PrincipalPriceComponentType | NumberComponentType).color,
            // width:
            //   comp.type === 'price'
            //     ? `${(comp as PrincipalPriceComponentType).width}%`
            //     : undefined,
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


  

  const updateModel = async () => {
    setIsUpdating(true)
    try{
      const response = await modelsServiceInstance.patchModel(modelId, components)

      if(response.ok){
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Modèle modifier avec succès !',
        })
        toggleShow()
      }else{
        setToastData({
          bg: 'danger',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-circle-xmark',
          message: 'Echec de la modification du modèle !',
        })
        toggleShow()
      }

    }catch(error){
      console.log(error)
      setToastData({
          bg: 'danger',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-circle-xmark',
          message: 'Echec de la modification du modèle !',
        })
        toggleShow()
    }finally{
      setIsUpdating(false)
      _getModels(setModels)
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
          onDoubleClick: (e: React.MouseEvent) => {
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
            top:comp.type === 'price' ? '5px' : '-10px',
            right:  '-15px',
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
            <div
            key={index}
            {...commonProps}
            style={{
              ...getStyleFromComponent(comp, isSelected),
              border: '1px dashed blue',
              overflow: 'visible',
              display: 'inline-flex', 
              alignItems: 'center',
              minWidth: '20px',
              width: 'auto', 
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
                fontSize: typedComp.fontSize,
                fontWeight: typedComp.fontWeight,
                color: typedComp.color,
                fontFamily: typedComp.fontFamily || 'Impact',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: "end",
                width: `${typedComp.text.length + 1}ch`, // largeur auto selon texte
                minWidth: '20px',
                padding: 0,
                margin: 0,
              }}
              autoFocus
            />
            <sup style={{ fontSize: '0.6em', marginLeft: '1px' }}>F</sup>
          </div>

          )
        }
        return (
          <div key={index} {...commonProps}>
            <div style={{ whiteSpace: 'nowrap' }}>
              <span style={{ textDecoration: typedComp.textDecoration ?? 'none' }}>
                {_thousandSeparator(parseInt(typedComp.text))}
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
                  fontFamily: textComp.fontFamily,
                  fontSize: textComp.fontSize,
                  fontWeight: textComp.fontWeight,
                  color: textComp.color,
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
            <span style={{ fontFamily: textComp.fontFamily, textDecoration: textComp.textDecoration ?? 'none' }}>{textComp.text}</span>
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
              src={API_URL + headerComp.src }
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
              src={API_URL + imgComp.src }
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
    API_URL
  ])

  /* component props
   *******************************************************************************************/
  const ComponentEditorProps = { components, selectedIndex, updateComponent }
  const modalUpdateModelProps = {
    showUpdateModel,
    handleCloseUpdateModel,
    updateModel,
    imageName,
    setImageName,
    idTemplate
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
          <Container className='py-'>
            <h4>Modifier le modèle N°{modelId}</h4>
          </Container>
          <Container className='px-5 mb-3'>
            <p>Dimensions {selectedDim?.width}X{selectedDim?.height}</p> 
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
            <Button variant='secondary' onClick={() => setIsUpdating(false)} className='me-4'>
              Annuler
            </Button>
            <Button
              variant='primary'
              onClick={() => _handleExportToPDF(newTemplateState)}
              className='me-4'
            >
              Visualiser en PDF
            </Button>
            <Button
              variant='success'
              onClick={() => {
                handleShowUpdateModel()
                // updateModel()
              }}
              className=''
            >
              Enregistrer les modification
            </Button>
          </div>
        </div>
        {/* Éditeur dynamique */}
        <ComponentEditor ComponentEditorProps={ComponentEditorProps} />
      </div>
      <ModalUpdateModel modalUpdateModelProps={modalUpdateModelProps} />
    </Container>
  )
}
