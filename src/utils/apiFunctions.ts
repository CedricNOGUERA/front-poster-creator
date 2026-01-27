import { SideBarDataType } from '@/components/DragDropComponents/SideBar'
import authServiceInstance from '@/services/AuthService'
import categoriesServiceInstance from '@/services/CategoriesServices'
import modelsServiceInstance from '@/services/modelsServices'
import shopServiceInstance from '@/services/ShopsServices'
import templatesServiceInstance from '@/services/TemplatesServices'
import UsersServices from '@/services/UsersServices'
import { Canvastype } from '@/types/CanvasType'
import { CategoriesPaginatedType, CategoriesType } from '@/types/CategoriesType'
import { FeedBackSatateType, PictureType, ToastDataType } from '@/types/DiversType'
import { ImagemodelType, ModelType } from '@/types/modelType'
import { ShopType } from '@/types/ShopType'
import { TemplateType } from '@/types/TemplatesType'
import { UserType } from '@/types/UserType'
import { AxiosError } from 'axios'
import React from 'react'
import { _expiredSession, _showToast } from './notifications'
import { NavigateOptions, To } from 'react-router-dom'
import VariousPicturesServices from '@/services/VariousPicturesServices'

const API_URL = import.meta.env.VITE_API_URL

///////////////////////
//Auth
///////////////////////

export const _registerUser = async (registerFormData: UserType) => {
  const response = await authServiceInstance.register(registerFormData)
  return response
}

export const _getMe = async (
  authLogin: (
    id: number,
    email: string,
    name: string,
    company: { idCompany: number; nameCompany: string }[],
    role: 'super_admin' | 'admin' | 'user'
  ) => void
) => {
  const response = await UsersServices.getMe()
  const data = await response.json()
  authLogin(data.id, data.email, data.name, data.company, data.role)
  return response
}

///////////////////////
//shop
///////////////////////

export const _getAllShops = async (
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  userLogOut: () => void,
  navigate: (to: To, options?: NavigateOptions) => void,
  toggleShow: () => void
) => {
  try {
    const response = await shopServiceInstance.getShops()
    setShops(response.data)
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.status === 403) {
        _expiredSession(
          (success, message, delay) =>
            _showToast(success, message, setToastData, toggleShow, delay),
          userLogOut,
          navigate
        )
      }
    }
  }
}

///////////////////////
//canvas
///////////////////////

export const _getCanvas = (
  setCanvasData: React.Dispatch<React.SetStateAction<Canvastype[]>>
) => {
  fetch(`${API_URL}/api/canvas`)
    .then((res) => res.json())
    .then((data) => {
      setCanvasData(data)
    })
    .catch((err) => console.error('Erreur lors du fetch des catégories', err))
}

export const _getCanvasById = async (
  id: number,
  setCanvas: React.Dispatch<React.SetStateAction<Canvastype>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void
) => {
  try {
    const response = await fetch(`${API_URL}/api/canvas/${id}`)

    if (!response.ok) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-circle-xmark',
        message:
          'Erreur ' +
          response.status +
          '. Une erreur est survenue lors de la récupération du canvas.',
      })
      toggleShow()
      throw new Error(`Erreur HTTP : ${response.status}`)
    } else {
      const data = await response.json()

      setCanvas(data)
    }
  } catch (err) {
    console.error('Erreur lors du fetch des canvas', err)
  }
}

export const _addCanvas = async (
  newCanvas: Canvastype,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void
) => {
  try {
    const response = await fetch(`${API_URL}/api/add-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCanvas),
    })

    if (!response.ok) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-circle-xmark',
        message:
          'Erreur ' +
          response.status +
          '. Une erreur est survenue lors de la création du canvas.',
      })
      toggleShow()
      throw new Error(`Erreur HTTP : ${response.status}`)
    }
    //   const data = await response.json();

    setToastData({
      bg: 'success',
      position: 'top-end',
      delay: 3000,
      icon: 'fa fa-check-circle',
      message: 'Canvas créé avec succès !',
    })
    toggleShow()
  } catch (err) {
    console.error('Erreur lors du fetch des canvas', err)
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 3000,
      icon: 'fa fa-circle-xmark',
      message: `Erreur réseau : ${err instanceof Error ? err.message : 'Inconnue'}`,
    })
    toggleShow()
  }
}

export const _uploadPicture = async (
  file: File | null,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void
) => {
  if (!file) return

  const formData = new FormData()
  formData.append('image', file) // "image" correspond à upload.single('image') dans le serveur

  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-circle-xmark',
        message:
          'Erreur ' +
          response.status +
          ". Une erreur est survenue lors du téléchargement de l'image.",
      })
      toggleShow()
      throw new Error(`Erreur HTTP : ${response.status}`)
    }
    //   const data = await response.json();

    setToastData({
      bg: 'success',
      position: 'top-end',
      delay: 3000,
      icon: 'fa fa-check-circle',
      message: 'Image téléchargée avec succès !',
    })
    toggleShow()
  } catch (err) {
    console.error('Erreur lors du fetch des canvas', err)
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 3000,
      icon: 'fa fa-circle-xmark',
      message: `Erreur réseau : ${err instanceof Error ? err.message : 'Inconnue'}`,
    })
    toggleShow()
  }
}

///////////////////////
//model
///////////////////////

export const _getModels = async (
  setModel: React.Dispatch<React.SetStateAction<ModelType[]>>
) => {
  try {
    const response = await modelsServiceInstance.getModels()
    const result = await response.json()
    setModel(result)
    return result
  } catch (error) {
    console.log(error)
    alert("Une erreur s'est produit lors de la récupération des models")
  }
}

export const _getModelsLength = async (
  setModelLength: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const response = await modelsServiceInstance.getModels()
    const result = await response.json()
    setModelLength(result.length)
    // return result.length
  } catch (error) {
    console.log(error)
  }
}

export const _deleteModel = async (id: number) => {
  try{
    const response = await modelsServiceInstance.deleteModel(id)
    return response
  }catch(error){
    console.log(error)
  }

}

export const _deleteModels = async (ids: number[]) => {
  try{

    ids.map(async (id) => {
      const response = await modelsServiceInstance.deleteModel(id)
      console.log(response)
    } )
  // const results = await Promise.allSettled(
  //   ids.map((id) => modelsServiceInstance.deleteModel(id))
  // )
  
  // results.forEach((result, index) => {
  //   if (result.status === 'rejected') {
  //     console.error(`Failed to delete model ${ids[index]}:`, result.reason)
  //   }
  // })

  // console.log(results)
    
  }catch(error){
    console.log(error)
  }

}


export const _getImagesModels = async (categoryId: number, setImagesModels: React.Dispatch<React.SetStateAction<ImagemodelType[]>>) => {

  try{
    const response = await modelsServiceInstance.getModelImage()
    const filteredImages = response.data.filter((img: ImagemodelType) => img.categoryId === categoryId)
    setImagesModels(filteredImages)
    return response
  }catch(error){
    console.log(error)
  }
}

export const _getAllImagesModels = async (setImagesModels: React.Dispatch<React.SetStateAction<ImagemodelType[]>>) => {

  try{
    const response = await modelsServiceInstance.getModelImage()

    setImagesModels(response.data)
    return response
  }catch(error){
    console.log(error)
  }
}


///////////////////////
//template
///////////////////////

export const _getTemplates = async (
  setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>
) => {
  await templatesServiceInstance.getTemplates(setTemplates)
}
export const _getTemplate = async (
  setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>,
  categoryId: number
) => {
  await templatesServiceInstance.getTemplate(setTemplates, categoryId)
}

export const _getTemplateLength = async (
  setTemplateLength: React.Dispatch<React.SetStateAction<number>>
) => {
  const response = await fetch(`${API_URL}/api/templates`)
  const result = await response.json()
  setTemplateLength(result.length)
}

export const _patchTemplate = async (
  id: number | undefined,
  data: Partial<TemplateType>,
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>,
  handleCloseAddEditModal: () => void,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void
) => {
  setFeedBackState((prev) => ({
    ...prev,
    isLoading: true,
    loadingMessage: 'Chargement',
  }))
  try {
    const response = await templatesServiceInstance.patchTemplates(id, data)

    if (response.status === 200) {
      handleCloseAddEditModal()
      setToastData({
        bg: 'success',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-check-circle',
        message: response.data.message ? response.data.message : 'Modification bien appliquée',
      })
      toggleShow()
    }
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof AxiosError) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 7000,
        icon: 'fa fa-xmark-circle',
        message: error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message === 'Network Error'
          ? 'Une erreur serveur est survenue, vérifier votre connexion internet. Si le problème persiste contactez votre administrateur'
          : 'Une erreur est survenue lors de la modification',
      })
      toggleShow()
    }
  } finally {
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: false,
      loadingMessage: '',
    }))
  }
}

///////////////////////
//category
///////////////////////

export const _getCategories = async (
  setCat: React.Dispatch<React.SetStateAction<CategoriesType[]>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void,
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
) => {
  setFeedBackState({
    isLoading: true,
    loadingMessage: 'Chargement des catégories...',
    isError: false,
    errorMessage: '',
  })
  try {
    const categories = await categoriesServiceInstance.getCategories(setCat)
    if (!categories.ok) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-check-circle',
        message:
          'Erreur ' +
          categories.status +
          '. Une erreur est survenue lors de la récupération des catégories.',
      })
      toggleShow()
      throw new Error(`Erreur HTTP : ${categories.status}`)
    }
  } catch (error) {
    console.log(error)
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 4000,
      icon: 'fa fa-circle-xmark',
      message:
        'Une erreur est survenue lors de la récupération des catégories. Vérifiez votre connexion internet.',
    })
    toggleShow()
  } finally {
    setFeedBackState({
      isLoading: false,
      loadingMessage: '',
      isError: false,
      errorMessage: '',
    })
  }
}
export const _getCategoriesPaginated = async (
  setCat: React.Dispatch<React.SetStateAction<CategoriesPaginatedType>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void,
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>,
  page: number,
  limit: number
) => {
  setFeedBackState({
    isLoading: true,
    loadingMessage: 'Chargement des catégories...',
    isError: false,
    errorMessage: '',
  })
  try {
    const categories = await categoriesServiceInstance.getCategoriesPaginated(
      setCat,
      page,
      limit
    )
    if (!categories.ok) {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-check-circle',
        message:
          'Erreur ' +
          categories.status +
          '. Une erreur est survenue lors de la récupération des catégories.',
      })
      toggleShow()
      throw new Error(`Erreur HTTP : ${categories.status}`)
    }
  } catch (error) {
    console.log(error)
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 4000,
      icon: 'fa fa-circle-xmark',
      message:
        'Une erreur est survenue lors de la récupération des catégories. Vérifiez votre connexion internet.',
    })
    toggleShow()
  } finally {
    setFeedBackState({
      isLoading: false,
      loadingMessage: '',
      isError: false,
      errorMessage: '',
    })
  }
}

export const _getCategoryById = async (
  id: number,
  setCategory: React.Dispatch<React.SetStateAction<CategoriesType>>
) => {
  try {
    const response = await categoriesServiceInstance.getCategoryById(id, setCategory)
    return response
  } catch (error) {
    console.log(error)
  }
}

export const _getCategoryPictures = async (
  categoryId: number,
  setSideBarData: React.Dispatch<React.SetStateAction<SideBarDataType[]>>,
  shopId: number,
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
) => {
  // const API_URL = API_URL;
  setFeedBackState({
    isLoading: true,
    loadingMessage: '',
    isError: false,
    errorMessage: '',
  })
  try {
    const result = await categoriesServiceInstance.getPicturesByCategory(categoryId)
    const data = await result.json()
    // console.log(data)
    if (data) {
      const pictures = data?.images.map((item: SideBarDataType) => {
        return {
          idShop: shopId,
          category: categoryId,
          image: `${item}`,
        }
      })
      setSideBarData(pictures)
    }
  } catch (error) {
    console.log(error)
  } finally {
    setFeedBackState({
      isLoading: false,
      loadingMessage: '',
      isError: false,
      errorMessage: '',
    })
  }
}

export const _handleUploadFile = async (
  file: File,
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  setSideBarData: React.Dispatch<React.SetStateAction<SideBarDataType[]>>,
  categoryId: number,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void,
  shopId: number
) => {
  if ((file && file?.type === 'image/png') || file?.type === 'image/jpeg') {
    console.log('Uploading file...')

    const formData = new FormData()
    formData.append('images', file)

    try {
      const result = await categoriesServiceInstance.uploadPicture(formData, categoryId)
      console.log(result)
      if (result.ok) {
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 4000,
          icon: 'fa fa-check-circle',
          message: 'Image ajoutée avec succès',
        })
        toggleShow()
      }
      if (!result.ok) {
        throw new Error("Erreur lors de l'upload de l'image")
      }
      setToastData({
        bg: 'success',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-check-circle',
        message: 'Image ajoutée avec succès',
      })
      toggleShow()

      setSideBarData((prev) => [
        ...prev,
        {
          idShop: shopId,
          category: categoryId,
          image: `/uploads/categories/images/${categoryId}/${file?.name}`,
        },
      ])
      console.log('fetch')
    } catch (error) {
      console.error(error)
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-circle-xmark',
        message: "Une erreur est survenue lors de l'ajout de l'image.",
      })
      toggleShow()
    } finally {
      setFile(null)
    }
  } else {
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 6000,
      icon: 'fa fa-exclamation-circle',
      message: "Erreur de type d'image, veuillez choisir une image au format png ou jpeg",
    })
    toggleShow()
    setFile(null)
  }
}

export const _handleDeleteImg = async (
  index: number | null,
  sideBarData: SideBarDataType[],
  setSideBarData: React.Dispatch<React.SetStateAction<SideBarDataType[]>>,
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>,
  toggleShow: () => void,
  categoryId: number
) => {
  const imageUrl = API_URL + sideBarData[index!].image
  console.log(imageUrl)
  try {
    const url = new URL(imageUrl)
    const pathnameParts = url.pathname.split('/')
    const pictureName = pathnameParts[pathnameParts.length - 1]
    const result = await categoriesServiceInstance.deletePictureCategory(
      categoryId,
      pictureName
    )

    if (result.ok) {
      setSideBarData((prev) => prev.filter((_, i) => i !== index))
      setToastData({
        bg: 'success',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-check-circle',
        message: 'Image supprimée avec succès',
      })
      toggleShow()
    } else {
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-circle-xmark',
        message: `Une erreur est survenue lors de la suppression de l'image. Erreur ${result.status}`,
      })
      toggleShow()
    }
  } catch (error) {
    console.log(error)
    setToastData({
      bg: 'danger',
      position: 'top-end',
      delay: 4000,
      icon: 'fa fa-circle-xmark',
      message: "Une erreur est survenue lors de la suppression de l'image.",
    })
    toggleShow()
  }
}

///////////////////////
//user
///////////////////////

export const _getAllUsers = async (
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>
) => {
  const response = await UsersServices.getAllUsers()
  const data = await response.json()
  setUsers(data)
}

///////////////////////
//Pictures
///////////////////////

export const _getPictures = async (
  setPictures: React.Dispatch<React.SetStateAction<PictureType[]>>
) => {
  try {
    const response = await VariousPicturesServices.getVariousPictures()
    if (response.status === 200) {
      setPictures(response?.data)
    }
  } catch (error) {
    console.log(error)
  }
}
