import { ModalAddEditCategory, ModalGenericDelete } from '@/components/ui/Modals';
import categoriesServiceInstance from '@/services/CategoriesServices';
import { CategoriesType } from '@/types/CategoriesType';
import { FeedBackSatateType, ToastDataType } from '@/types/DiversType';
import { ShopType } from '@/types/ShopType';
import { _getCategories } from '@/utils/apiFunctions';
import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import TableLoader from '@/components/ui/squeleton/TableLoader';
import { _getAllShops } from '@/utils/apiFunctions';
import TableHeader from '@/components/ui/table/TableHeader';
import MenuDrop from '@/components/ui/table/MenuDrop';
import userDataStore, { UserDataType } from '@/stores/userDataStore';
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
  const columnsData = ['ID', 'Nom', 'Image', 'Magasins', 'Actions']
  const [categories, setCategories] = React.useState<CategoriesType[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoriesType>({} as CategoriesType);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File| null>(null)
  const [imgRglt, setImgRglt] = React.useState<File| null>(null)
  const [shopData, setShopData] = React.useState<ShopType[]>([]);

  const [showAddEditModal, setShowAddEditModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const trigger = "categories"

  useEffect(() => {
    _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
    _getAllShops(setShopData);
  }, [setFeedBackState, setToastData]);




  const categorieDisplay = (categories: CategoriesType[]) => {
    return categories
    .filter((item) => {
      if(userRole === "super_admin"){
        return true
      }
      if(userRole === "admin"){

        return item.shopIds.some((shopId) => 
          userData.company.some((comp) => 
            shopId === comp.idCompany
      )
        )
      }
    })
    .map((category) => (
      <tr key={category.id}>
        <td>{category.id}</td>
        <td>{category.name}</td>
        <td className='bg-secondary'>
          <Image src={API_URL + category.image} alt={category.name} width={100} />
        </td>
        <td>
          {category.shopIds.map((shop: number, indx: number) => (
            <span key={indx}>{shopDisplay(shopData, shop, indx, category)}</span>
          ))}
        </td>
        <td>
          <MenuDrop
            trigger={trigger}
            data={category}
            handleShowEditModal={
              handleShowEditModal as (data: CategoriesType) => void | null | undefined
            }
            handleShowDeleteModal={handleShowDeleteModal}
          />
        </td>
      </tr>
    ))
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
      const response = await categoriesServiceInstance.updateCategory(id, formData)
      if (response.ok) {
        _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
        handleCloseAddEditModal()
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check-circle',
          message: 'Catégorie modifiée avec succès !',
        })
        toggleShow()
      } else {
        console.error("Erreur lors de la modification de la catégorie");
      }
    } catch (err) {
      console.error("Erreur lors de la modification de la catégorie:", err);
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
      if (response.ok) {
        handleCloseDeleteModal();
        _getCategories(setCategories, setToastData, toggleShow, setFeedBackState);
      } else {
        console.error("Erreur lors de la suppression de la catégorie");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
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
  
  const modalAddEditCategoryProps = { showAdd: showAddEditModal, handleCloseAdd: handleCloseAddEditModal, handleSubmit: handleUpdateCategory, formData: selectedCategory, setFormData: setSelectedCategory, setFile: setFile, setImgRglt: setImgRglt, feedBackState: feedBackState, shopData: shops };
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
      </Container>

      <ModalAddEditCategory modalAddEditCategoryProps={modalAddEditCategoryProps} />
      <ModalGenericDelete modalGenericDeleteProps={modalDeleteCategoryProps} />
    </Container>
  )
}