/**
 * Utilitaires pour convertir les PDFs en images avec contenu réel
 * Utilise PDF.js via CDN pour extraire le contenu des PDFs
 */

export interface PDFPage {
  imageData: string
  width: number
  height: number
  pageNumber: number
}

// Déclaration globale pour PDF.js
declare global {
  interface Window {
    pdfjsLib: any
  }
}

/**
 * Charge PDF.js depuis le CDN
 */
const loadPDFJS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      if (window.pdfjsLib) {
        // Configurer le worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve(window.pdfjsLib)
      } else {
        reject(new Error('PDF.js n\'a pas pu être chargé'))
      }
    }
    script.onerror = () => {
      reject(new Error('Erreur lors du chargement de PDF.js'))
    }
    document.head.appendChild(script)
  })
}

/**
 * Convertit un PDF en images avec contenu réel
 */
export const convertPDFToImages = async (pdfFile: File): Promise<PDFPage[]> => {
  try {
    const pdfjsLib = await loadPDFJS()
    
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages: PDFPage[] = []

    // Convertir chaque page en image
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 }) // Échelle pour la qualité
      
      // Créer un canvas pour rendre la page
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Impossible de créer le contexte canvas')
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      // Rendre la page sur le canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      // Convertir en image
      const imageData = canvas.toDataURL('image/png', 1.0)
      
      pages.push({
        imageData,
        width: viewport.width,
        height: viewport.height,
        pageNumber: pageNum
      })
    }
console.log(pages)
    return pages
  } catch (error) {
    console.error('Erreur lors de la conversion PDF:', error)
    // Fallback vers la version simplifiée
    return convertPDFToImagesFallback(pdfFile)
  }
}

/**
 * Version de fallback qui crée un aperçu visuel du PDF
 */
const convertPDFToImagesFallback = async (pdfFile: File): Promise<PDFPage[]> => {
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
  
  return [{
    imageData,
    width,
    height,
    pageNumber: 1
  }]
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
