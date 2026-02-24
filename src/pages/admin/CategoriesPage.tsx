/* eslint-disable react-hooks/exhaustive-deps */
import { ModalAddEditCategory, ModalDuplicateCategory, ModalGenericDelete } from '@/components/ui/Modals';
import categoriesServiceInstance from '@/services/CategoriesServices';
import { CategoriesType } from '@/types/CategoriesType';
import { FeedBackSatateType, ToastDataType } from '@/types/DiversType';
import { ShopType } from '@/types/ShopType';
import { _getCategories, _getCategoriesPaginated } from '@/utils/apiFunctions';
import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import {useNavigate, useOutletContext } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import TableLoader from '@/components/ui/squeleton/TableLoader';
import TableHeader from '@/components/ui/table/TableHeader';
import MenuDrop from '@/components/ui/table/MenuDrop';
import userDataStore, { UserDataType } from '@/stores/userDataStore';
import { AxiosError } from 'axios';
import { _expiredSession, _showToast } from '@/utils/notifications';
import SearchBar from '@/components/dashBoardComponents/SearchBar';
import { _validateFormData } from '@/utils/functions';
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
  const [selectedCategory, setSelectedCategory] = React.useState<CategoriesType>({} as CategoriesType);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File| null>(null)
  const [imgRglt, setImgRglt] = React.useState<File| null>(null)

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [allCategories, setAllCategories] = React.useState<CategoriesType[]>([]);



  const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const trigger = "categories"

  useEffect(() => {
    _getCategories(setAllCategories, setToastData, toggleShow, setFeedBackState);
  }, []);

  // Fonction de filtrage des catégories en fonction du terme de recherche ou pas
  const categorys = React.useMemo(() => {
    if (searchTerm.trim() === "") {
      return allCategories;
    }

    const lowerTerm = searchTerm.toLowerCase().trim();

    return allCategories.filter((category) => {
      const matchesId =
        category?.id && category.id.toString().includes(lowerTerm);
      const matchesName = category.name.toLowerCase().includes(lowerTerm);

      return matchesId || matchesName;
    });
  }, [searchTerm, allCategories]);
    


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

        _getCategories(setAllCategories, setToastData, toggleShow, setFeedBackState);
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
        _getCategories(setAllCategories, setToastData, toggleShow, setFeedBackState);
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


const shopDisplay = (shopData: ShopType[], shop: number, indx: number, category: CategoriesType) => {
  const shopName = shopData && shopData.find((shops) => shops.id === shop)?.name
  const shopConna = (indx < category.shopIds.length - 1 ? ', ' : '')

  return ( shopName && shopName + shopConna)
}

  const categorieDisplay = (categorys: CategoriesType[]) => {
    return categorys
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


  const modalAddEditCategoryProps = { showAdd: showAddEditModal, handleCloseAdd: handleCloseAddEditModal, handleSubmit: handleUpdateCategory, formData: selectedCategory, setFormData: setSelectedCategory, setFile: setFile, setImgRglt: setImgRglt, feedBackState: feedBackState, shopData: shops };
  const modalDuplicateCategoryProps = {showDuplicate, handleCloseDuplicate, selectedCategory, setSelectedCategory, setAllCategories}
  const modalDeleteCategoryProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, selectedId: selectedCategoryId, handleDelete: handleDeleteCategory,title: 'la catégorie', isLoading };

  return (
    <Container fluid className='p-0'>
      <h3 className='py-3 mb-0'>Gestion des Catégories</h3>
            <SearchBar seachBarProps={{searchTerm, setSearchTerm, data: categorys}} />
      <Container>
        <Table striped hover responsive='sm' className='shadow'>
          <TableHeader columnsData={columnsData} />
          <tbody>
            {!feedBackState.isLoading && categorys?.length > 0 ? (
              <>{categorieDisplay(categorys)}</>
            ) : (
              <TableLoader lengthTr={5} lengthTd={5} />
            )}
          </tbody>
        </Table>
     
      </Container>
    
      <ModalAddEditCategory modalAddEditCategoryProps={modalAddEditCategoryProps} />
      <ModalDuplicateCategory modalDuplicateCategoryProps={modalDuplicateCategoryProps} />
      <ModalGenericDelete modalGenericDeleteProps={modalDeleteCategoryProps} />
    </Container>
  )
}