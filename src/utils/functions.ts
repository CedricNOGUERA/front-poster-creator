import { StoreType } from '@/stores/storeApp'
import { BackgroundComponentType, ComponentTypeMulti, HeaderComponentType } from '@/types/ComponentType'
import { NewTemplateType, ToastDataType } from '@/types/DiversType'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Canvastype } from '@/types/CanvasType'
import { NavigateOptions, To } from 'react-router-dom'
import moment from 'moment'

export const _thousandSeparator = (number: number, locale: string = 'fr-FR'): string => {
  return number?.toLocaleString(locale, {
    minimumFractionDigits: 0, // Pas de décimales
  })
}

export const _downloadJSON = (components: ComponentTypeMulti[]) => {
  const json = JSON.stringify(components, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas-model.json'
  a.click()
  URL.revokeObjectURL(url)
}

export const _handleExportToPDF = async (newTemplateState: NewTemplateType) => {
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
      format: [newTemplateState.width ?? 300, newTemplateState.height ?? 300],
    })

    pdf.addImage(
      imageData,
      'PNG',
      0,
      0,
      newTemplateState.width ?? 300,
      newTemplateState.height ?? 300
    )
    pdf.save('design.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    // Restore the original border style ALWAYS
    canvasElement.style.border = originalBorderStyle
  }
}

export const _handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
  e.dataTransfer.setData('componentType', type)
}

export const handleDragStartImg = (
  e: React.DragEvent<HTMLDivElement>,
  type: string,
  src: string
) => {
  e.dataTransfer.setData('componentType', type)
  if (type === 'image') {
    e.dataTransfer.setData('componentSrc', src)
  }
}

export const _handleDragStartImg = (
  e: React.DragEvent<HTMLDivElement>,
  type: string,
  src: string,
) => {
  e.dataTransfer.setData('componentType', type)
  if (type === 'image') {
    e.dataTransfer.setData('componentSrc', src)


  }
}

export const _handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
}

export const _updateComponent = (updatedFields: Partial<ComponentTypeMulti>, selectedIndex: number |null, components: ComponentTypeMulti[],setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>) => {
    if (selectedIndex === null) return

    const updated = [...components]
    if (updated[selectedIndex]) {
      updated[selectedIndex] = {
        ...updated[selectedIndex],
        ...updatedFields,
      }
      setComponents(updated)
    } else {
      console.error('Attempted to update non-existent component at index:', selectedIndex)
    }
}

export const _handleDeleteComponent = (indexToDelete: number, setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>> ,setSelectedIndex: React.Dispatch<React.SetStateAction<number |null>>) => {
  setComponents((prevComponents) =>
    prevComponents.filter((_, index) => index !== indexToDelete)
  )
  setSelectedIndex(null)
}

export const _generateInitalComponent2 = (
  canvas: ComponentTypeMulti[],
  storeApp: StoreType,
  newTemplateState: NewTemplateType,
  setNewTemplateState: React.Dispatch<React.SetStateAction<NewTemplateType>>,
  maxPreviewHeight: number,
  h: number | undefined,
  // components: ComponentTypeMulti[],
  setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>,
  setDimensionFactor: React.Dispatch<React.SetStateAction<number | null>>,

) => {
  const shopId = storeApp.shopId
  const initalDimensionFactor =
    newTemplateState.height && maxPreviewHeight / newTemplateState.height

  setNewTemplateState((prev) => ({
    ...prev,
    idShop: shopId,
    idCategory: storeApp.categoryId,
    // nameCategory: canvas ? canvas.name : '',
  }))
  
  if (shopId !== undefined) {
    const initialImageSrc = h && h >= 100 ? (canvas?.[0] as HeaderComponentType)?.src : h && h < 100 && (canvas?.[0] as HeaderComponentType)?.srcRglt  !== null
      ? (canvas?.[0] as HeaderComponentType)?.srcRglt  : (canvas?.[0] as HeaderComponentType)?.src


    if (h && h >= 100) {
      const headerBgWidth = (newTemplateState.width && newTemplateState.width) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height / 3.5

      const headerComponent: HeaderComponentType = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.[0] as BackgroundComponentType)
          ?.backgroundColor,
      }
  
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top:
          newTemplateState.height && initalDimensionFactor
            ? (newTemplateState.height * initalDimensionFactor) / 3.5
            : 0,
        left: 0,
        width: initalDimensionFactor && headerBgWidth * initalDimensionFactor,
        height:
          newTemplateState.height && initialContainerHeight && initalDimensionFactor
            ? (newTemplateState.height - initialContainerHeight) * initalDimensionFactor
            : 0,
            backgroundColor: (canvas?.[1] as BackgroundComponentType)
            ?.backgroundColor,
      }
      
      if (canvas?.length > 3) {
        // const updated = [...components];
        // updated[0] = headerComponent;
        // updated[1] = yellowComponent;
        // setComponents(updated);
        setComponents(canvas);
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
      
    } else {
      //reglette display
      const headerBgWidth = (newTemplateState.width && newTemplateState.width / 4) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height
      //Red Background
      const headerComponent: ComponentTypeMulti = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.[0] as BackgroundComponentType)?.backgroundColor,
      }
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top: 0,
        left:
          initalDimensionFactor && newTemplateState.width
            ? headerBgWidth * initalDimensionFactor
            : 0,
        width:
          initalDimensionFactor &&
          newTemplateState.width &&
          (newTemplateState.width - headerBgWidth) * initalDimensionFactor,
        height: 150,
        backgroundColor: (canvas?.[1] as BackgroundComponentType)?.backgroundColor,
      }
      if (canvas?.length > 3) {
        // const updated = [...components];
        // updated[0] = headerComponent;
        // updated[1] = yellowComponent;
        // setComponents(updated);
        setComponents(canvas);
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
    
    }
  }

  if (newTemplateState.height) {
    setDimensionFactor(maxPreviewHeight / newTemplateState.height)
  }
}
export const _generateInitalComponent = (
  canvas: ComponentTypeMulti[],
  storeApp: StoreType,
  newTemplateState: NewTemplateType,
  setNewTemplateState: React.Dispatch<React.SetStateAction<NewTemplateType>>,
  maxPreviewHeight: number,
  h: number | undefined,
  components: ComponentTypeMulti[],
  setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>,
  setDimensionFactor: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const shopId = storeApp.shopId
  const initalDimensionFactor =
    newTemplateState.height && maxPreviewHeight / newTemplateState.height

  setNewTemplateState((prev) => ({
    ...prev,
    idShop: shopId,
    idCategory: storeApp.categoryId,
    // nameCategory: canvas ? canvas.name : '',
  }))
  
  if (shopId !== undefined) {
    const initialImageSrc =
      h && h >= 98
        ? (canvas?.[0] as HeaderComponentType)?.src
        : h && h < 98 && (canvas?.[0] as HeaderComponentType)?.srcRglt !== null
        ? (canvas?.[0] as HeaderComponentType)?.srcRglt
        : (canvas?.[0] as HeaderComponentType)?.src


    if (h && h >= 98) {
      const headerBgWidth = (newTemplateState.width && newTemplateState.width) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height / 3.5

      const headerComponent: HeaderComponentType = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.[0] as BackgroundComponentType)
          ?.backgroundColor,
      }
  
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top:
          newTemplateState.height && initalDimensionFactor
            ? (newTemplateState.height * initalDimensionFactor) / 3.5
            : 0,
        left: 0,
        width: initalDimensionFactor && headerBgWidth * initalDimensionFactor,
        height:
          newTemplateState.height && initialContainerHeight && initalDimensionFactor
            ? (newTemplateState.height - initialContainerHeight) * initalDimensionFactor
            : 0,
            backgroundColor: (canvas?.[1] as BackgroundComponentType)
            ?.backgroundColor,
      }
      
      if (components?.length >= 3) {
        const updated = [...components];
        updated[0] = headerComponent;
        updated[1] = yellowComponent;
        setComponents(updated);
      
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
      
    } else {
      //reglette display
      const headerBgWidth = (newTemplateState.width && newTemplateState.width / 4) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height
      //Red Background
      const headerComponent: ComponentTypeMulti = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.[0] as BackgroundComponentType)?.backgroundColor,
      }
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top: 0,
        left:
          initalDimensionFactor && newTemplateState.width
            ? headerBgWidth * initalDimensionFactor
            : 0,
        width:
          initalDimensionFactor &&
          newTemplateState.width &&
          (newTemplateState.width - headerBgWidth) * initalDimensionFactor,
        height: 150,
        backgroundColor: (canvas?.[1] as BackgroundComponentType)?.backgroundColor,
      }
      if (components?.length >= 3) {
        const updated = [...components];
        updated[0] = headerComponent;
        updated[1] = yellowComponent;
        setComponents(updated);
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
    
    }
  }

  if (newTemplateState.height) {
    setDimensionFactor(maxPreviewHeight / newTemplateState.height)
  }
}
export const _generateInitalComponent_old = (
  canvas: Canvastype,
  storeApp: StoreType,
  newTemplateState: NewTemplateType,
  setNewTemplateState: React.Dispatch<React.SetStateAction<NewTemplateType>>,
  maxPreviewHeight: number,
  h: number | undefined,
  components: ComponentTypeMulti[],
  setComponents: React.Dispatch<React.SetStateAction<ComponentTypeMulti[]>>,
  setDimensionFactor: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const shopId = storeApp.shopId
  const initalDimensionFactor =
    newTemplateState.height && maxPreviewHeight / newTemplateState.height

  setNewTemplateState((prev) => ({
    ...prev,
    idShop: shopId,
    idCategory: storeApp.categoryId,
    nameCategory: canvas ? canvas.name : '',
  }))
  
  if (shopId !== undefined) {
    const initialImageSrc = h && h >= 100 ? (canvas?.canvas?.[0] as HeaderComponentType)?.src : h && h < 100 && (canvas?.canvas?.[0] as HeaderComponentType)?.srcRglt  !== null
      ? (canvas?.canvas?.[0] as HeaderComponentType)?.srcRglt  : (canvas?.canvas?.[0] as HeaderComponentType)?.src
 

    if (h && h >= 100) {
      const headerBgWidth = (newTemplateState.width && newTemplateState.width) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height / 3.5

      const headerComponent: HeaderComponentType = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.canvas?.[0] as BackgroundComponentType)
          ?.backgroundColor,
      }
     
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top:
          newTemplateState.height && initalDimensionFactor
            ? (newTemplateState.height * initalDimensionFactor) / 3.5
            : 0,
        left: 0,
        width: initalDimensionFactor && headerBgWidth * initalDimensionFactor,
        height:
          newTemplateState.height && initialContainerHeight && initalDimensionFactor
            ? (newTemplateState.height - initialContainerHeight) * initalDimensionFactor
            : 0,
            backgroundColor: (canvas?.canvas?.[1] as BackgroundComponentType)
            ?.backgroundColor,
      }
      
      if (components.length > 3) {
        const updated = [...components];
        updated[0] = headerComponent;
        updated[1] = yellowComponent;
        console.log(updated)
        setComponents(updated);
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
      
    } else {
      //reglette display
      const headerBgWidth = (newTemplateState.width && newTemplateState.width / 4) ?? 500
      const initialContainerHeight = newTemplateState.height && newTemplateState.height
      //Red Background
      const headerComponent: ComponentTypeMulti = {
        type: 'header',
        top: 0,
        left: 0,
        width: initalDimensionFactor ? headerBgWidth * initalDimensionFactor : 0,
        height:
          initialContainerHeight && initalDimensionFactor
            ? initialContainerHeight * initalDimensionFactor
            : 0,
        src: initialImageSrc,
        backgroundColor: (canvas?.canvas?.[0] as BackgroundComponentType).backgroundColor,
      }
      //Yellow background
      const yellowComponent: ComponentTypeMulti = {
        type: 'background-color',
        top: 0,
        left:
          initalDimensionFactor && newTemplateState.width
            ? headerBgWidth * initalDimensionFactor
            : 0,
        width:
          initalDimensionFactor &&
          newTemplateState.width &&
          (newTemplateState.width - headerBgWidth) * initalDimensionFactor,
        height: 150,
        backgroundColor: (canvas?.canvas?.[1] as BackgroundComponentType).backgroundColor,
      }
      if (components.length > 3) {
        const updated = [...components];
        updated[0] = headerComponent;
        updated[1] = yellowComponent;
        setComponents(updated);
      } else {
        setComponents([headerComponent, yellowComponent]);
      }
    
    }
  }

  if (newTemplateState.height) {
    setDimensionFactor(maxPreviewHeight / newTemplateState.height)
  }
}

export const _handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
  if (e.target.files) {
    setFile(e.target.files[0])
  }
}

export const _expiredSession = (setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>, toggleShow: () => void, userLogOut: () => void, navigate: (to: To, options?: NavigateOptions) => void) => {
  setToastData({
    bg: 'danger',
    position: 'top-end',
    delay: 4000,
    icon: 'fa fa-times-circle',
    message: "Votre session est expirée, veuillez vous reconnecter",
  })
  toggleShow()
  userLogOut()
  setTimeout(() => {
    navigate('/login')
  }, 5000)
}

export const _formattedDate = (date: string) => {
const formattedDate = moment(date).format('DD/MM/YYYY à hh:mm:ss')

return formattedDate
}

type Status = 'succes' | 'error' | 'warning' | 'pending';
type BadgeColor = 'success' | 'danger' | 'warning' | 'info' | 'primary';

export const _statusBadge = (status: Status): BadgeColor => {

  const colorMap: Record<Status, BadgeColor> = {
    succes: 'success',
    error: 'danger',
    warning: 'warning',
    pending: 'info',
  };
  
  return colorMap[status] ?? 'primary';
}

