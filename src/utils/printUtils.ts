import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { NewTemplateType } from '@/types/DiversType'
import { convertPDFToSingleImage } from './pdfConverterReal'

export interface PrintLayout {
  rows: number
  cols: number
  totalCopies: number
  spacing: number
  customLayout?: 'portrait-3'
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
//original
// export const calculateOptimalLayout = (
//   posterWidth: number,
//   posterHeight: number,
//   pageWidth: number,
//   pageHeight: number,
//   maxCopies: number,
//   spacing: number = 5
// ): PrintLayout => {
//   const availableWidth = pageWidth - (spacing * 2)
//   const availableHeight = pageHeight - (spacing * 2)

//   let bestLayout: PrintLayout = { rows: 1, cols: 1, totalCopies: 1, spacing }
//   let maxCopiesFound = 1

//   // Essayer différentes configurations
//   for (let cols = 1; cols <= 20; cols++) {
//     for (let rows = 1; rows <= 20; rows++) {
//       const totalCopies = cols * rows
//       if (totalCopies > maxCopies) continue

//       const requiredWidth = (posterWidth * cols) + (spacing * (cols - 1))
//       const requiredHeight = (posterHeight * rows) + (spacing * (rows - 1))

//       if (requiredWidth <= availableWidth && requiredHeight <= availableHeight) {
//         if (totalCopies > maxCopiesFound) {
//           maxCopiesFound = totalCopies
//           bestLayout = { rows, cols, totalCopies, spacing }
//         }
//       }
//     }
//   }

//   return bestLayout
// }
export const calculateOptimalLayout = (
  posterWidth: number,
  posterHeight: number,
  pageWidth: number,
  pageHeight: number,
  copiesPerPage: number,
  spacing: number
): PrintLayout => {
  const margin = Math.max(spacing, 1)
  const availableWidth = pageWidth - (margin * 2)
  const availableHeight = pageHeight - (margin * 2)

  // CAS SPÉCIAL : 3 copies (2 en haut, 1 en bas centré)
  if (copiesPerPage === 3) {
    const twoWidthHorizontal = (posterWidth * 2) + spacing
    const twoHeightVertical = (posterHeight * 2) + spacing
    
    // Configuration portrait : 2 en haut, 1 en bas
    if (twoWidthHorizontal <= availableWidth && twoHeightVertical <= availableHeight) {
      return { 
        rows: 2, 
        cols: 2, 
        totalCopies: 3, 
        spacing: margin,
        customLayout: 'portrait-3'
      }
    }
    
    // Fallback : essayer 3×1 horizontal
    const threeWidthHorizontal = (posterWidth * 3) + (spacing * 2)
    if (threeWidthHorizontal <= availableWidth && posterHeight <= availableHeight) {
      return { rows: 1, cols: 3, totalCopies: 3, spacing: margin }
    }
    
    // Fallback : essayer 1×3 vertical
    const threeHeightVertical = (posterHeight * 3) + (spacing * 2)
    if (posterWidth <= availableWidth && threeHeightVertical <= availableHeight) {
      return { rows: 3, cols: 1, totalCopies: 3, spacing: margin }
    }
  }

  // ALGORITHME STANDARD
  let bestLayout: PrintLayout = { rows: 1, cols: 1, totalCopies: 1, spacing: margin }
  let maxCopies = 0

  const maxPossibleCols = Math.floor((availableWidth + spacing) / (posterWidth + spacing))
  const maxPossibleRows = Math.floor((availableHeight + spacing) / (posterHeight + spacing))

  for (let cols = 1; cols <= maxPossibleCols && cols <= 10; cols++) {
    for (let rows = 1; rows <= maxPossibleRows && rows <= 10; rows++) {
      const totalCopies = cols * rows
      
      if (totalCopies > copiesPerPage) continue

      const requiredWidth = (posterWidth * cols) + (spacing * (cols - 1))
      const requiredHeight = (posterHeight * rows) + (spacing * (rows - 1))

      if (requiredWidth <= availableWidth && requiredHeight <= availableHeight) {
        if (totalCopies > maxCopies || totalCopies === copiesPerPage) {
          maxCopies = totalCopies
          bestLayout = { rows, cols, totalCopies, spacing: margin }
          
          if (totalCopies === copiesPerPage) {
            return bestLayout
          }
        }
      }
    }
  }

  return bestLayout
}

/**
 * Génère un PDF avec plusieurs copies de la même affiche
 */
//original
// export const generateMultipleCopiesPDF = async (
//   canvasElement: HTMLElement,
//   templateState: NewTemplateType,
//   options: PrintOptions,
//    templateName: string
// ): Promise<void> => {
//   if (!templateState.width || !templateState.height) {
//     throw new Error('Dimensions du template non définies')
//   }

//   const pageDimensions = getPageDimensions(options)

//   const layout = calculateOptimalLayout(
//     templateState.width,
//     templateState.height,
//     pageDimensions.width,
//     pageDimensions.height,
//     options.copiesPerPage || 4,
//     options.spacing || 5
//   )

//   // Capturer le canvas avec haute résolution
//   const canvas = await html2canvas(canvasElement, {
//     scale: 4,
//     useCORS: true,
//     logging: false,
//     backgroundColor: '#ffffff',
//     allowTaint: true,
//     imageTimeout: 0,
//     removeContainer: false,
//   })

//   const imgData = canvas.toDataURL('image/png', 1.0)
//   const posterWidth = templateState.width
//   const posterHeight = templateState.height

//   // Créer le PDF
//   const pdf = new jsPDF({
//     orientation: pageDimensions.height > pageDimensions.width ? 'portrait' : 'landscape',
//     unit: 'mm',
//     format: [pageDimensions.width, pageDimensions.height],
//   })

//   // Ajouter les copies
//   for (let row = 0; row < layout.rows; row++) {
//     for (let col = 0; col < layout.cols; col++) {
//       const x = layout.spacing + (col * (posterWidth + layout.spacing))
//       const y = layout.spacing + (row * (posterHeight + layout.spacing))
      
//       pdf.addImage(
//         imgData,
//         'PNG',
//         x,
//         y,
//         posterWidth,
//         posterHeight,
//         undefined,
//         'FAST'
//       )
//     }
//   }

//   const filename = `affiche-multiple-${templateName}-${templateState.width}x${templateState.height}-${layout.totalCopies}-copies.pdf`
//   pdf.save(filename)
// }

export const generateMultipleCopiesPDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions,
  templateName: string
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

  // CAS SPÉCIAL : 3 copies en portrait (2 en haut, 1 en bas à droite)
  if (layout.customLayout === 'portrait-3') {
    const positions = [
      { row: 0, col: 0 },     // Haut gauche
      { row: 0, col: 1 },     // Haut droite
      { row: 1, col: 0 },   // Bas droite
    ]
    
    positions.forEach((pos) => {
      const x = layout.spacing + (pos.col * (posterWidth + layout.spacing))
      const y = layout.spacing + (pos.row * (posterHeight + layout.spacing))
      
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
    })
  } else {
    // DISPOSITION STANDARD (grille rectangulaire)
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const index = row * layout.cols + col
        if (index >= layout.totalCopies) break
        
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
  }

  const filename = `affiche-multiple-${templateName}-${templateState.width}x${templateState.height}-${layout.totalCopies}-copies.pdf`
  pdf.save(filename)
}

/**
 * Génère un PDF simple (une seule copie)
 */
export const generateSinglePDF = async (
  canvasElement: HTMLElement,
  templateState: NewTemplateType,
  options: PrintOptions,
  templateName: string
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

  pdf.save(`affiche-simple-${templateName}-${templateState.width}x${templateState.height}.pdf`)
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
  options: PrintOptions,
  templateName: string
): Promise<void> => {
  try {
    switch (options.mode) {
      case 'single':
        await generateSinglePDF(canvasElement, templateState, options, templateName)
        break
      case 'multiple':
        await generateMultipleCopiesPDF(canvasElement, templateState, options, templateName)
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
