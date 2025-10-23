import useStoreApp from '@/stores/storeApp'
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ToastDataType } from '@/types/DiversType'
import { CategoriesType } from '@/types/CategoriesType'
import { _getCategories } from '@/utils/apiFunctions'
import categoriesServiceInstance from '@/services/CategoriesServices'
import { ModalAddCategory } from '../ui/Modals'
import { ComponentTypeMulti } from '@/types/ComponentType'
import userDataStore from '@/stores/userDataStore'
import { _expiredSession, _showToast } from '@/utils/notifications'
import { ShopType } from '@/types/ShopType'
import { FaPlusCircle } from 'react-icons/fa'
import DynamicIcon from '../ui/DynamicIcon'
// import { IconType } from 'react-icons';

type Props = {
  title: string
}

export type FormCategoryDataType = {
  name: string
  icon: { name: string; value: string }
  image: string
  imageRglt: string
  backgroundColorHeader: string
  backgroundColorBody: string
  shopIds: number[]
  canvas: ComponentTypeMulti[]
}

interface ContextCategorySelectorDragType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  shops: ShopType[]
}

export default function CategorySelectorDrag({ title }: Props) {
  /* States
   *******************************************************************************************/
  const { toggleShow, setToastData, shops } = useOutletContext<ContextCategorySelectorDragType>()
  const storeApp = useStoreApp()
  const userLogOut = userDataStore((state) => state.authLogout)
  const navigate = useNavigate()
  // const [shopData, setshopData] = React.useState<ShopType[]>([])
  const [cat, setCat] = React.useState<CategoriesType[]>([])
  const [file, setFile] = React.useState<File | null>(null)
  const [imgRglt, setImgRglt] = React.useState<File | null>(null)
  const [feedBackState, setFeedBackState] = React.useState({
    isLoading: false,
    loadingMessage: '',
    isError: false,
    errorMessage: '',
  })
  const [validated, setValidated] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<{ [key: string]: string }>({})
  const [formData, setFormData] = React.useState<FormCategoryDataType>({
    name: '',
    icon: { name: '', value: '' },
    image: '',
    imageRglt: '',
    backgroundColorHeader: '#ff0000',
    backgroundColorBody: '#ffea00',
    shopIds: [],
    canvas: [],
  })
  const [showAdd, setShowAdd] = React.useState(false)
  const handleCloseAdd = () => {
    resetForm()
    setShowAdd(false)
  }
  const handleShowAdd = () => setShowAdd(true)


  /* useEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getCategories(setCat, setToastData, toggleShow, setFeedBackState)
  }, [setToastData, toggleShow])

  /* functions
   *******************************************************************************************/

  // Fonction de validation en temps réel
  const validateField = (fieldName: string, value: string) => {
    const errors = { ...fieldErrors }
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Le nom est requis'
        } else if (value.trim().length < 2) {
          errors.name = 'Le nom doit contenir au moins 2 caractères'
        } else {
          delete errors.name
        }
        break
      case 'icon':
        if (!value.trim()) {
          errors.icon = "L'icône est requise"
        } else if (!value.trim().startsWith('fa fa-')) {
          errors.icon = 'L\'icône doit commencer par "fa fa-"'
        } else {
          delete errors.icon
        }
        break
      case 'backgroundColorHeader':
      case 'backgroundColorBody':
        if (!hexColorRegex.test(value)) {
          errors[fieldName] = 'Veuillez sélectionner une couleur valide'
        } else {
          delete errors[fieldName]
        }
        break
      default:
        break
    }

    setFieldErrors(errors)
  }

  const onHandleCategory = (id: number) => {
    const idCanvas =
      cat && cat?.find((category: CategoriesType) => category.id === id)?.canvasId
    if (idCanvas) {
      storeApp.setCanvasId(idCanvas)
    }
    storeApp.setDimensionId(9)
    storeApp.setCategoryId(id)
    storeApp.nextStep()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    // Validation du formulaire
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
      return
    }

    // Validation personnalisée
    if (formData.name.trim() === '') {
      setFeedBackState((prev) => ({
        ...prev,
        isError: true,
        errorMessage: 'Veuillez saisir un nom de catégorie',
        isLoading: false,
        loadingMessage: '',
      }))
      setValidated(true)
      return
    }

    if (formData.name.trim().length < 2) {
      setFeedBackState((prev) => ({
        ...prev,
        isError: true,
        errorMessage: 'Le nom de la catégorie doit contenir au moins 2 caractères',
        isLoading: false,
        loadingMessage: '',
      }))
      setValidated(true)
      return
    }

    if (formData.shopIds.length === 0) {
      setFeedBackState((prev) => ({
        ...prev,
        isError: true,
        errorMessage: 'Veuillez sélectionner au moins un magasin',
        isLoading: false,
        loadingMessage: '',
      }))
      setValidated(true)
      return
    }

    setValidated(true)
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Chargement...',
      isError: false,
      errorMessage: '',
    }))

    const lastId = cat.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0)
    const nextId = lastId + 1

    const imageName = file?.name
      ? `/uploads/categories/headerPictures/${nextId}/${file?.name}`
      : null
    const imageRgltName = imgRglt?.name
      ? `/uploads/categories/headerPictures/${nextId}/${imgRglt?.name}`
      : null

    try {
      const newCategory = {
        id: cat.length + 1,
        name: formData.name,
        icon: formData.icon,
        image: imageName,
        imageRglt: imageRgltName,
        shopIds: formData.shopIds,
        canvasId: cat.length + 1,
        canvas: [
          {
            type: 'header',
            top: 0,
            left: 0,
            width: 500,
            height: 125,
            src: imageName,
            srcRglt: imageRgltName,
            backgroundColor: formData.backgroundColorHeader,
          },
          {
            type: 'background-color',
            top: 125,
            left: 0,
            width: 500,
            height: 375,
            backgroundColor: formData.backgroundColorBody,
          },
        ],
      }

      const categoryFormData = new FormData()
      categoryFormData.append('data', JSON.stringify(newCategory))
      if (file) {
        categoryFormData.append('image', file)
      }
      if (imgRglt) {
        categoryFormData.append('imageRglt', imgRglt)
      }
      // Log entries to properly inspect FormData
      for (const pair of categoryFormData.entries()) {
        console.log(pair[0] + ': ', pair[1])
      }
      const addCatResponse = await categoriesServiceInstance.postCategory(categoryFormData)

      if (addCatResponse.ok) {
        setValidated(true)
        setCat((prev: CategoriesType[]) => [...prev, newCategory as unknown as CategoriesType])
        setFormData({
          name: '',
          icon: { name: '', value: '' },
          image: '',
          imageRglt: '',
          backgroundColorHeader: '#ff0000',
          backgroundColorBody: '#ffea00',
          shopIds: [],
          canvas: [],
        })
        setValidated(false)

        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Catégorie ajoutée avec succès',
        })
        toggleShow()
        handleCloseAdd()
      }else if (!addCatResponse.ok && addCatResponse.status === 403) {
          _expiredSession(
            (success, message, delay) => _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate
        )
      
    }
    } catch (error) {
      console.log(error)
      setFeedBackState((prev) => ({
        ...prev,
        error: true,
        errorMessage: "Une erreur s'est produite lors de l'ajout de la catégorie",
      }))
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 4000,
        icon: 'fa fa-times-circle',
        message: "Une erreur s'est produite lors de l'ajout de la catégorie",
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

  const resetForm = () => {
    setFormData({
      name: '',
      icon: { name: '', value: '' },
      image: '',
      imageRglt: '',
      backgroundColorHeader: '#ff0000',
      backgroundColorBody: '#ffea00',
      shopIds: [],
      canvas: [],
    })
    setFile(null)
    setImgRglt(null)
    setValidated(false)
    setFieldErrors({})
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: false,
      loadingMessage: '',
      isError: false,
      errorMessage: '',
    }))
  }

  const modalAddCategoryProps = {
    showAdd,
    handleCloseAdd,
    handleSubmit,
    formData,
    setFormData,
    setFile,
    setImgRglt,
    feedBackState,
    shops,
    validated,
    file,
    fieldErrors,
    validateField,
  }
  
  /* render
   *******************************************************************************************/
  return (
    <>
      <h2 className='fs-4 fw-bold text-primary'>{title}</h2>
      <div className='d-flex flex-wrap justify-content-center  align-items-center mt-5 mb-5'>
        {cat &&
          cat.map((category: CategoriesType) => {
            if (category.shopIds.includes(storeApp.shopId)) {
              return (
                <div
                  key={category.id}
                  className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center'
                  style={{ width: '200px', height: '183px' }}
                  onClick={() => onHandleCategory(category.id as number)}
                >
                <DynamicIcon iconKey={category.icon.value} size={42} className="text-primary" />
                  <p className='mt-2 text-center fw-bold fs-5 text-primary'>{category.name}</p>
                </div>
              )
            }
          })}
        <div
          className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center'
          style={{ width: '200px', height: '183px' }}
          onClick={() => handleShowAdd()}
        >
          <FaPlusCircle className='text-primary fs-1' />
          <p className='mt-2 text-center fw-bold fs-5 text-primary'>
            N<sup>velle</sup> catégorie
          </p>
        </div>
        <ModalAddCategory modalAddCategoryProps={modalAddCategoryProps} />
      </div>
    </>
  )
}
