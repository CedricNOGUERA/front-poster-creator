import { ModalAddCategory, ModalAddEditCategory, ModalDuplicateCategory, ModalGenericDelete } from '@/components/ui/Modals';
import categoriesServiceInstance from '@/services/CategoriesServices';
import { CategoriesPaginatedType, CategoriesType } from '@/types/CategoriesType';
import { FeedBackSatateType, ToastDataType } from '@/types/DiversType';
import { ShopType } from '@/types/ShopType';
import { _getCategories, _getCategoriesPaginated } from '@/utils/apiFunctions';
import React, { useEffect } from 'react';
import { Container, Table, Pagination, Form, Button } from 'react-bootstrap';
import {useNavigate, useOutletContext } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import TableLoader from '@/components/ui/squeleton/TableLoader';
import TableHeader from '@/components/ui/table/TableHeader';
import MenuDrop from '@/components/ui/table/MenuDrop';
import userDataStore, { UserDataType } from '@/stores/userDataStore';
import { AxiosError } from 'axios';
import { _expiredSession, _showToast } from '@/utils/notifications';
import { FormCategoryDataType } from '@/components/step-selector/CategorySelectorDrag';
interface ContextSideBarType {
    toggleShow: () => void
    setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
    shops: ShopType[]
    feedBackState: FeedBackSatateType
    setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
  }

export default function CategoriesPage() {
  const API_URL = import.meta.env.VITE_API_URL
  const userRole = userDataStore((state: UserDataType) => state.role)
  const userData = userDataStore((state: UserDataType) => state)

  const {toggleShow, setToastData, shops, feedBackState, setFeedBackState} = useOutletContext<ContextSideBarType>()
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const navigate = useNavigate()
  const columnsData = ['ID', 'Nom', 'Image', 'Magasins', 'Actions']
  const [categoriesPaginated, setCategoriesPaginated] = React.useState<CategoriesPaginatedType>({} as CategoriesPaginatedType);
  const [categories, setCategories] = React.useState<CategoriesType[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoriesType>({} as CategoriesType);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File| null>(null)
  const [imgRglt, setImgRglt] = React.useState<File| null>(null)
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [activePage, setActivePage] = React.useState<number>(1);

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

  const [validated, setValidated] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<{ [key: string]: string }>({})

  const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const trigger = "categories"

  useEffect(() => {
    // _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
    _getCategoriesPaginated(setCategoriesPaginated, setToastData, toggleShow, setFeedBackState, page, limit);
  }, [setFeedBackState, setToastData, page, limit]);

  useEffect(() => {
    setCategories(categoriesPaginated.categories)
  }, [categoriesPaginated]);




  const categorieDisplay = (categories: CategoriesType[]) => {
    return categories
      .filter((item) => {
        if (userRole === 'super_admin') {
          return true
        }
        if (userRole === 'admin') {
          return item.shopIds.some((shopId) =>
            userData.company.some((comp) => shopId === comp.idCompany)
          )
        }
      })
      .map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td className='bg-secondary'>
            {category.image && (
              <Image src={API_URL + category.image} alt={category.name} width={100} />
            )}
          </td>
          <td>
            {category.shopIds.map((shop: number, indx: number) => (
              <span key={indx}>{shopDisplay(shops, shop, indx, category)}</span>
            ))}
          </td>
          <td>
            <MenuDrop
              trigger={trigger}
              data={category}
              handleShowEditModal={
                handleShowEditModal as (data: CategoriesType) => void | null | undefined
              }
              handleShowDuplicate={handleShowDuplicate as (category: CategoriesType) => void | null | undefined}
              handleShowDeleteModal={handleShowDeleteModal}
            />
          </td>
        </tr>
      ))
  }


  const itemCategoriesDisplay = Array.from({length: categoriesPaginated?.pagination?.totalPages}).map((_, index) => (
    <Pagination.Item key={index} onClick={() => {
      setPage(index + 1)
      setActivePage(index + 1)
      _getCategoriesPaginated(setCategoriesPaginated, setToastData, toggleShow, setFeedBackState, index + 1,limit)


    }}
    active={activePage === index + 1}
    className='text-dark'
    >{index + 1}</Pagination.Item>
  
  ))

  const [showAdd, setShowAdd] = React.useState(false)
  const handleCloseAdd = () => {
    resetForm()
    setShowAdd(false)
  }
  const handleShowAdd = () => setShowDuplicate(true)


  const [showDuplicate, setShowDuplicate] = React.useState(false)
  const handleCloseDuplicate = () => {
    setSelectedCategory({} as CategoriesType)
    setShowDuplicate(false)
  }
  const handleShowDuplicate = (category: CategoriesType) => {
    setSelectedCategory(category);
    setShowDuplicate(true);
  }

  const handleShowEditModal = (category: CategoriesType) => {
    setSelectedCategory(category);
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setSelectedCategory({} as CategoriesType);
  };

  const handleShowDeleteModal = (id: number) => {
    setSelectedCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCategory({} as CategoriesType);
  };

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

    const lastId = categories.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0)
    const nextId = lastId + 1

    const imageName = file?.name
      ? `/uploads/categories/headerPictures/${nextId}/${file?.name}`
      : null
    const imageRgltName = imgRglt?.name
      ? `/uploads/categories/headerPictures/${nextId}/${imgRglt?.name}`
      : null

    try {
      const newCategory = {
        id: nextId,
        name: formData.name,
        icon: formData.icon,
        image: imageName,
        imageRglt: imageRgltName,
        shopIds: formData.shopIds,
        canvasId: nextId,
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
      // for (const pair of categoryFormData.entries()) {
      //   console.log(pair[0] + ': ', pair[1])
      // }
      const addCatResponse = await categoriesServiceInstance.postCategory(categoryFormData)

      if (addCatResponse.ok) {
        setValidated(true)
        setCategories((prev: CategoriesType[]) => [...prev, newCategory as unknown as CategoriesType])
        _getCategoriesPaginated(setCategoriesPaginated, setToastData, toggleShow, setFeedBackState, page, limit);
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



  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setFeedBackState({
      isLoading: true,
      loadingMessage: "Modification en cours...",
      isError: false,
      errorMessage: "",
    })
    const { id, ...dataWithoutId } = selectedCategory;
    const formData = new FormData()
    formData.append('data', JSON.stringify(dataWithoutId))
    if (file) {
      formData.append('image', file)
    }
    if (imgRglt) {
      formData.append('imageRglt', imgRglt)
    }
    try {
      const updateResponse = await categoriesServiceInstance.updateCategory(id, formData)
// const patchtemplateResponse = await _patchTemplate(selectedModel.id, data, setFeedBackState, handleCloseAddEditModal, setToastData, toggleShow)

      if (updateResponse.status === 200) {

        _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
        handleCloseAddEditModal()
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Catégorie modifiée avec succès !',
        })
        toggleShow()}

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Erreur lors de la modification de la catégorie:', error)
        if (error?.response?.data.code === 'TOKEN_EXPIRED' && error.status === 401)
          console.log('Votre session est expirée')
        _expiredSession(
          (success: boolean, message: string, delay: number) =>
            _showToast(success, message, setToastData, toggleShow, delay),
          userLogOut,
          navigate
        )
      }
    } finally {
      setFeedBackState({
        isLoading: false,
        loadingMessage: "",
        isError: false,
        errorMessage: "",
      })
    }

  }
  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    setFeedBackState({
      isLoading: true,
      loadingMessage: "Suppression en cours...",
      isError: false,
      errorMessage: "",
    })
    setIsLoading(true);
    try {
      const response = await categoriesServiceInstance.deleteCategory(selectedCategoryId);
      if (response.status === 200) {
        handleCloseDeleteModal();
        _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Catégorie supprimée avec succès !',
        })
        toggleShow()
      } else {
        console.error("Erreur lors de la suppression de la catégorie");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      if(error instanceof AxiosError){
        console.log(error.response)
        if (error?.response?.data.code === 'TOKEN_EXPIRED' && error.status === 401)
          
        _expiredSession(
          (success: boolean, message: string, delay: number) =>
            _showToast(success, message, setToastData, toggleShow, delay),
          userLogOut,
          navigate
        )
      }
    } finally {
      setFeedBackState({
        isLoading: false,
        loadingMessage: "",
        isError: false,
        errorMessage: "",
      })
      setIsLoading(false); // Fin isLoadingDelete
  };
}

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


const shopDisplay = (shopData: ShopType[], shop: number, indx: number, category: CategoriesType) => {
  const shopName = shopData && shopData.find((shops) => shops.id === shop)?.name
  const shopConna = (indx < category.shopIds.length - 1 ? ', ' : '')

  return ( shopName && shopName + shopConna)
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
  const modalAddEditCategoryProps = { showAdd: showAddEditModal, handleCloseAdd: handleCloseAddEditModal, handleSubmit: handleUpdateCategory, formData: selectedCategory, setFormData: setSelectedCategory, setFile: setFile, setImgRglt: setImgRglt, feedBackState: feedBackState, shopData: shops };
  const modalDuplicateCategoryProps = {showDuplicate, handleCloseDuplicate, selectedCategory, setSelectedCategory, setCategoriesPaginated, page, limit}
  const modalDeleteCategoryProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, selectedId: selectedCategoryId, handleDelete: handleDeleteCategory,title: 'la catégorie', isLoading };

  return (
    <Container fluid className='p-0'>
      <h3 className='py-3 mb-0'>Gestion des Catégories</h3>
      {/* <Row className='bg-light sticky-top d-flex justify-content-between align-items-center w-100 gx-5'>
        <Col xs={1} className=' ps-sm-2'>
          <Link to='/tableau-de-bord' className='text-muted'>
            <i className='fa-solid fa-circle-arrow-left fs-3'></i>
          </Link>
        </Col>
        <Col xs={10}>
          <h3 className='py-3 mb-0'>Gestion des Catégories</h3>
        </Col>
        <Col xs={1}></Col>
      </Row> */}

      <Container>
        <Table striped hover responsive='sm' className='shadow'>
          <TableHeader columnsData={columnsData} />
          <tbody>
            {!feedBackState.isLoading && categories?.length > 0 ? (
              <>{categorieDisplay(categories)}</>
            ) : (
              <TableLoader lengthTr={5} lengthTd={5} />
            )}
          </tbody>
        </Table>
        {categoriesPaginated?.pagination?.totalItems >= limit && (
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <Pagination>
                <Pagination.Prev 
                disabled={!categoriesPaginated?.pagination?.hasPreviousPage}
                onClick={() => {
                  
                  setPage(page - 1)
                  _getCategoriesPaginated(
                    setCategoriesPaginated,
                    setToastData,
                    toggleShow,
                    setFeedBackState,
                    page - 1,
                    limit
                  )
                }} />
                {itemCategoriesDisplay}
                <Pagination.Next 
                disabled={!categoriesPaginated?.pagination?.hasNextPage}
                onClick={() => {
                  
                  setPage(page + 1)
                  _getCategoriesPaginated(
                    setCategoriesPaginated,
                    setToastData,
                    toggleShow,
                    setFeedBackState,
                    page + 1,
                    limit
                  )
                }}
                />

              </Pagination>
            </div>
            <div className='d-flex justify-content-end align-items-center gap-2 w-50'>
              <small>Catégories par page</small>
              <Form.Select
                style={{ width: '71px' }}
                size='sm'
                aria-label='Default select example'
                value={limit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setLimit(parseInt(e.target.value))

                  _getCategoriesPaginated(
                    setCategoriesPaginated,
                    setToastData,
                    toggleShow,
                    setFeedBackState,
                    1,
                    parseInt(e.target.value)
                  )
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
            </div>
          </div>
        )}
      </Container>
      <Button variant='primary' className='d-none rounded-pill fab' 
      onClick={handleShowAdd}
      >
        <strong>+</strong> <span>Ajouter une catégorie</span>
      </Button>
      <ModalAddCategory modalAddCategoryProps={modalAddCategoryProps} />
      <ModalAddEditCategory modalAddEditCategoryProps={modalAddEditCategoryProps} />
      <ModalDuplicateCategory modalDuplicateCategoryProps={modalDuplicateCategoryProps} />
      <ModalGenericDelete modalGenericDeleteProps={modalDeleteCategoryProps} />
    </Container>
  )
}