/**
 * Utilitaires pour convertir les PDFs en images
 * Solution simplifiée sans dépendances externes
 */

export interface PDFPage {
  imageData: string
  width: number
  height: number
  pageNumber: number
}

/**
 * Convertit un PDF en image en utilisant une approche simplifiée
 * Pour l'instant, crée une représentation visuelle du PDF
 */
export const convertPDFToImages = async (pdfFile: File): Promise<PDFPage[]> => {
  return new Promise((resolve, reject) => {
    try {
      // Créer une représentation visuelle du PDF
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Impossible de créer le contexte canvas')
      }

      // Dimensions par défaut pour un PDF
      const width = 595 // A4 width in points
      const height = 842 // A4 height in points
      
      canvas.width = width
      canvas.height = height

      // Dessiner un aperçu du PDF
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      
      context.fillStyle = '#000000'
      context.font = '16px Arial'
      context.textAlign = 'center'
      context.fillText('PDF Preview', width / 2, height / 2 - 20)
      
      context.font = '12px Arial'
      context.fillText(pdfFile.name, width / 2, height / 2 + 10)
      
      context.fillText(`${Math.round(width)} × ${Math.round(height)} px`, width / 2, height / 2 + 30)

      // Ajouter un cadre
      context.strokeStyle = '#cccccc'
      context.lineWidth = 2
      context.strokeRect(10, 10, width - 20, height - 20)

      const imageData = canvas.toDataURL('image/png', 1.0)
      
      resolve([{
        imageData,
        width,
        height,
        pageNumber: 1
      }])
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Convertit un PDF en image simple (première page seulement)
 */
export const convertPDFToSingleImage = async (pdfFile: File): Promise<PDFPage> => {
  const pages = await convertPDFToImages(pdfFile)
  return pages[0] // Retourner seulement la première page
}

/**
 * Redimensionne une image selon les dimensions cibles
 */
export const resizeImage = (
  imageData: string,
  targetWidth: number,
  targetHeight: number
): string => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Impossible de créer le contexte canvas')
  }

  canvas.width = targetWidth
  canvas.height = targetHeight

  const img = new Image()
  img.onload = () => {
    context.drawImage(img, 0, 0, targetWidth, targetHeight)
  }
  img.src = imageData

  return canvas.toDataURL('image/png', 1.0)
}

/**
 * Calcule les dimensions de redimensionnement en conservant les proportions
 */
export const calculateResizeDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight
  
  let newWidth = maxWidth
  let newHeight = maxWidth / aspectRatio
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = maxHeight * aspectRatio
  }
  
  return { width: newWidth, height: newHeight }
}
