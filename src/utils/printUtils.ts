import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { NewTemplateType } from '@/types/DiversType'
import { convertPDFToSingleImage } from './pdfConverterReal'

export interface PrintLayout {
  rows: number
  cols: number
  totalCopies: number
  spacing: number
}

export interface PageDimensions {
  width: number
  height: number
}

export interface PrintOptions {
  mode: 'single' | 'multiple' | 'combine'
  pageFormat: 'A4' | 'A3' | 'custom'
  customDimensions?: PageDimensions
  copiesPerPage?: number
  spacing?: number
  uploadedPDFs?: File[]
  resizeMode?: 'proportional' | 'original' | 'fit'
}

// Helper pour obtenir des dimensions de page valides
const getPageDimensions = (opts: PrintOptions): PageDimensions => {
  if (opts.pageFormat === 'custom' && opts.customDimensions) {
    return opts.customDimensions
  }
  // Cast restreint car PrintOptions ne propose que 'A4' | 'A3' en plus de 'custom'
  const key = opts.pageFormat as 'A4' | 'A3'
  return PAGE_DIMENSIONS[key]
}

// Dimensions des formats de page en mm
export const PAGE_DIMENSIONS = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
  A5: { width: 148, height: 210 },
  A2: { width: 420, height: 594 },
  A1: { width: 594, height: 841 },
  A0: { width: 841, height: 1189 }
}

/**
 * Calcule le layout optimal pour placer plusieurs copies d'une affiche sur une page
 */
export const calculateOptimalLayout = (
  posterWidth: number,
  posterHeight: number,
  pageWidth: number,
  pageHeight: number,
  maxCopies: number,
  spacing: number = 5
): PrintLayout => {
  const availableWidth = pageWidth - (spacing * 2)
  const availableHeight = pageHeight - (spacing * 2)

  let bestLayout: PrintLayout = { rows: 1, cols: 1, totalCopies: 1, spacing }
  let maxCopiesFound = 1

  // Essayer différentes configurations
  for (let cols = 1; cols <= 20; cols++) {
    for (let rows = 1; rows <= 20; rows++) {
      const totalCopies = cols * rows
      if (totalCopies > maxCopies) continue

      const requiredWidth = (posterWidth * cols) + (spacing * (cols - 1))
      const requiredHeight = (posterHeight * rows) + (spacing * (rows - 1))

      if (requiredWidth <= availableWidth && requiredHeight <= availableHeight) {
        if (totalCopies > maxCopiesFound) {
          maxCopiesFound = totalCopies
          bestLayout = { rows, cols, totalCopies, spacing }
        }
      }
    }
  }

  return bestLayout
}

/**
 * Génère un PDF avec plusieurs copies de la même affiche
 */
export const generateMultipleCopiesPDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions
): Promise<void> => {
  if (!templateState.width || !templateState.height) {
    throw new Error('Dimensions du template non définies')
  }

  const pageDimensions = getPageDimensions(options)

  const layout = calculateOptimalLayout(
    templateState.width,
    templateState.height,
    pageDimensions.width,
    pageDimensions.height,
    options.copiesPerPage || 4,
    options.spacing || 5
  )

  // Capturer le canvas avec haute résolution
  const canvas = await html2canvas(canvasElement, {
    scale: 4,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    imageTimeout: 0,
    removeContainer: false,
  })

  const imgData = canvas.toDataURL('image/png', 1.0)
  const posterWidth = templateState.width
  const posterHeight = templateState.height

  // Créer le PDF
  const pdf = new jsPDF({
    orientation: pageDimensions.height > pageDimensions.width ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pageDimensions.width, pageDimensions.height],
  })

  // Ajouter les copies
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = layout.spacing + (col * (posterWidth + layout.spacing))
      const y = layout.spacing + (row * (posterHeight + layout.spacing))
      
      pdf.addImage(
        imgData,
        'PNG',
        x,
        y,
        posterWidth,
        posterHeight,
        undefined,
        'FAST'
      )
    }
  }

  const filename = `affiche-multiple-${layout.totalCopies}-copies.pdf`
  pdf.save(filename)
}

/**
 * Génère un PDF simple (une seule copie)
 */
export const generateSinglePDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions
): Promise<void> => {
  // Marque le paramètre comme utilisé pour la linter
  void options

  // Capturer le canvas
  const canvas = await html2canvas(canvasElement, {
    scale: 4,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    imageTimeout: 0,
    removeContainer: false,
  })

  const imgData = canvas.toDataURL('image/png', 1.0)

  // Créer le PDF avec les dimensions exactes de l'affiche
  const pdf = new jsPDF({
    orientation: (templateState.height || 0) > (templateState.width || 0) ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [templateState.height || 297, templateState.width || 210],
  })

  pdf.addImage(
    imgData,
    'PNG',
    0,
    0,
    templateState.width || 210,
    templateState.height || 297,
    undefined,
    'FAST'
  )

  pdf.save('affiche-simple.pdf')
}

/**
 * Génère un PDF combiné avec plusieurs affiches différentes
 */
export const generateCombinedPDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions
): Promise<void> => {
  const pageDimensions = getPageDimensions(options)

  
  // Capturer le canvas actuel
  const canvas = await html2canvas(canvasElement, {
    scale: 4,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    imageTimeout: 0,
    removeContainer: false,
  })
  console.log(templateState)

  const imgData = canvas.toDataURL('image/png', 1.0)
  const posterWidth = templateState.width || 210
  const posterHeight = templateState.height || 297

  // Créer le PDF combiné
  const pdf = new jsPDF({
    orientation: pageDimensions.height > pageDimensions.width ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pageDimensions.width, pageDimensions.height],
  })

  const spacing = options.spacing || 5
  // PDF.js renders pages into a canvas in CSS pixels at 96 dpi, multiplied by the viewport scale (here 2).
  // That means effective dpi ~= 96 * 2 = 192. Convert pixels to millimeters accordingly for jsPDF.
  const PX_TO_MM = 1/5.67
  let currentX = spacing
  let currentY = spacing
  let maxHeightInRow = posterHeight

  // Ajouter l'affiche actuelle
  pdf.addImage(imgData, 'PNG', currentX, currentY, posterWidth, posterHeight, undefined, 'FAST')
  currentX += posterWidth + spacing
  maxHeightInRow = Math.max(maxHeightInRow, posterHeight)

  // Traiter les PDFs uploadés
  if (options.uploadedPDFs && options.uploadedPDFs.length > 0) {
    for (const pdfFile of options.uploadedPDFs) {
      try {
        // Convertir le PDF en image
        const pdfPage = await convertPDFToSingleImage(pdfFile)
        
        // Calculer les dimensions de redimensionnement
        const availableWidth = pageDimensions.width - currentX - spacing
        const availableHeight = pageDimensions.height - currentY - spacing
        
        if (availableWidth <= 0 || availableHeight <= 0) {
          // Passer à la ligne suivante
          currentX = spacing
          currentY += maxHeightInRow + spacing
          maxHeightInRow = 0
        }

        // Calculer les dimensions selon le mode choisi
        // let resizeDimensions: { width: number; height: number }
  
        // Dimensions originales du PDF converties en millimètres
        // const originalWidthMm = pdfPage.width
        // const originalHeightMm = pdfPage.height
        const originalWidthMm = pdfPage.width * PX_TO_MM
        const originalHeightMm = pdfPage.height * PX_TO_MM
        
        // switch (options.resizeMode ?? 'original') {
        //   case 'original':
            // Conserver les dimensions d'origine (converties en mm)
            // resizeDimensions = {
            //   width: originalWidthMm,
            //   height: originalHeightMm
            // }
            // break
          // case 'fit':
          //   // Ajuster pour maximiser l'utilisation de l'espace
          //   resizeDimensions = calculateResizeDimensions(
          //     originalWidthMm,
          //     originalHeightMm,
          //     availableWidth,
          //     availableHeight
          //   )
          //   break
          // case 'proportional':
          // default: {
          //   // Redimensionnement proportionnel intelligent
          //   const maxAllowedWidth = Math.min(availableWidth, posterWidth) // Ne jamais dépasser la taille de l'affiche
          //   const maxAllowedHeight = Math.min(availableHeight, posterHeight)
            
          //   resizeDimensions = calculateResizeDimensions(
          //     originalWidthMm,
          //     originalHeightMm,
          //     maxAllowedWidth,
          //     maxAllowedHeight
          //   )
          //   break
          // }
        // }
    

        // Vérifier si l'image rentre dans l'espace disponible
        if (originalWidthMm <= availableWidth && originalHeightMm <= availableHeight) {
          pdf.addImage(
            pdfPage.imageData,
            'PNG',
            currentX,
            currentY,
            originalWidthMm,
            originalHeightMm,
            // resizeDimensions.width,
            // resizeDimensions.height,
            undefined,
            'FAST'
          )
          
          currentX += originalWidthMm + spacing
          // currentX += resizeDimensions.width + spacing
          // maxHeightInRow = Math.max(maxHeightInRow, resizeDimensions.height)
          maxHeightInRow = Math.max(maxHeightInRow, originalHeightMm)
        } else {
          // L'image ne rentre pas, passer à la ligne suivante
          currentX = spacing
          currentY += maxHeightInRow + spacing
          maxHeightInRow = originalHeightMm
          
          // Vérifier si on a encore de la place
          if (currentY + originalHeightMm > pageDimensions.height) {
            console.warn(`Le PDF ${pdfFile.name} ne peut pas être ajouté, pas assez d'espace`)
            break
          }
          
          pdf.addImage(
            pdfPage.imageData,
            'PNG',
            currentX,
            currentY,
            originalWidthMm,
            originalHeightMm,
            undefined,
            'FAST'
          )
          
          currentX += originalWidthMm + spacing
        }
      } catch (error) {
        console.error(`Erreur lors du traitement du PDF ${pdfFile.name}:`, error)
        // Continuer avec les autres PDFs
      }
    }
  }

  pdf.save('affiche-combinee.pdf')
}

/**
 * Fonction principale pour générer un PDF selon les options choisies
 */
export const generatePDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions
): Promise<void> => {
  try {
    switch (options.mode) {
      case 'single':
        await generateSinglePDF(canvasElement, templateState, options)
        break
      case 'multiple':
        await generateMultipleCopiesPDF(canvasElement, templateState, options)
        break
      case 'combine':
        await generateCombinedPDF(canvasElement, templateState, options)
        break
      default:
        throw new Error('Mode d\'impression non supporté')
    }
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    throw error
  }
}

/**
 * Vérifie si une affiche peut tenir sur une page avec les dimensions données
 */
export const canFitOnPage = (
  posterWidth: number,
  posterHeight: number,
  pageWidth: number,
  pageHeight: number,
  spacing: number = 5
): boolean => {
  const availableWidth = pageWidth - (spacing * 2)
  const availableHeight = pageHeight - (spacing * 2)
  
  return posterWidth <= availableWidth && posterHeight <= availableHeight
}

/**
 * Calcule le facteur de réduction nécessaire pour faire tenir une affiche sur une page
 */
export const calculateScaleFactor = (
  posterWidth: number,
  posterHeight: number,
  pageWidth: number,
  pageHeight: number,
  spacing: number = 5
): number => {
  const availableWidth = pageWidth - (spacing * 2)
  const availableHeight = pageHeight - (spacing * 2)
  
  const scaleX = availableWidth / posterWidth
  const scaleY = availableHeight / posterHeight
  
  return Math.min(scaleX, scaleY, 1) // Ne pas agrandir, seulement réduire
}
