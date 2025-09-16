/**
 * Utilitaires simples pour gérer les PDFs uploadés
 * Version sans dépendances externes - crée des aperçus visuels
 */

export interface PDFPage {
  imageData: string
  width: number
  height: number
  pageNumber: number
}

/**
 * Crée un aperçu visuel d'un PDF uploadé
 */
export const convertPDFToImages = async (pdfFile: File): Promise<PDFPage[]> => {
  return new Promise((resolve, reject) => {
    try {
      // Créer un aperçu visuel du PDF
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Impossible de créer le contexte canvas')
      }

      // Dimensions par défaut pour un PDF (A4 en points)
      const width = 595
      const height = 842
      
      canvas.width = width
      canvas.height = height

      // Fond blanc
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      
      // Bordure
      context.strokeStyle = '#cccccc'
      context.lineWidth = 2
      context.strokeRect(10, 10, width - 20, height - 20)

      // Icône PDF
      context.fillStyle = '#dc3545'
      context.font = 'bold 48px Arial'
      context.textAlign = 'center'
      context.fillText('PDF', width / 2, height / 2 - 40)
      
      // Nom du fichier
      context.fillStyle = '#000000'
      context.font = 'bold 16px Arial'
      context.fillText(pdfFile.name, width / 2, height / 2 + 10)
      
      // Taille du fichier
      const fileSize = (pdfFile.size / 1024).toFixed(1)
      context.font = '12px Arial'
      context.fillText(`${fileSize} KB`, width / 2, height / 2 + 35)
      
      // Dimensions
      context.fillText(`${width} × ${height} px`, width / 2, height / 2 + 55)

      // Lignes décoratives
      context.strokeStyle = '#e9ecef'
      context.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = 100 + (i * 20)
        context.beginPath()
        context.moveTo(50, y)
        context.lineTo(width - 50, y)
        context.stroke()
      }

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
  return pages[0]
}

/**
 * Redimensionne une image selon les dimensions cibles
 */
export const resizeImage = (
  imageData: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      reject(new Error('Impossible de créer le contexte canvas'))
      return
    }

    canvas.width = targetWidth
    canvas.height = targetHeight

    const img = new Image()
    img.onload = () => {
      context.drawImage(img, 0, 0, targetWidth, targetHeight)
      resolve(canvas.toDataURL('image/png', 1.0))
    }
    img.onerror = () => {
      reject(new Error('Erreur lors du chargement de l\'image'))
    }
    img.src = imageData
  })
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
