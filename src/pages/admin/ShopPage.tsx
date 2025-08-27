import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { ShopType } from '@/types/ShopType';
import shopServiceInstance from '@/services/ShopsServices';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ModalAddShop, ModalGenericDelete } from '@/components/ui/Modals';
import { ToastDataType } from '@/types/DiversType';
import TableLoader from '@/components/ui/squeleton/TableLoader';
import TableHeader from '@/components/ui/table/TableHeader';
import MenuDrop from '@/components/ui/table/MenuDrop';
import { AxiosError } from 'axios';
import { _expiredSession, _showToast } from '@/utils/notifications';
import userDataStore, { UserDataType } from '@/stores/userDataStore';
interface ContextCategorySelectorDragType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
}

export default function ShopPage() {
  const API_URL = import.meta.env.VITE_API_URL
  const columnsData = ['ID', 'logo', 'Nom', 'Actions']
  const {setToastData, toggleShow} = useOutletContext<ContextCategorySelectorDragType>()
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const navigate = useNavigate()
  const [shops, setShops] = useState<ShopType[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [file, setFile] = React.useState<File| null>(null)
  const trigger = "shops"

  const [feedBackState, setFeedBackState] = React.useState({
    isLoading: false,
    loadingMessage: "",
    isError: false,
    errorMessage: "",
  })
  const [formData, setFormData] = React.useState<{
    name: string
    image: string
  }>({
    name: '',
    image: '',
  })


useEffect(() => {
  getAllShops();
}, []);

const shopDisplay = (shops: ShopType[]) => {
  return shops.map((shop) => (
    <tr key={shop.id} className='align-middle'>
      <td>{shop.id}</td>
      <td>
        <img src={API_URL +"/"+ shop.cover} alt={shop?.name} width={50} /></td>
      <td>{shop?.name}</td>
      <td>
        <MenuDrop
          trigger={trigger}
          data={shop}
          handleShowDeleteModal={handleShowDeleteModal}
        />
      </td>
    </tr>
  ))
}

const getAllShops = async () => {
  setIsLoading(true);
  try {
    const response = await shopServiceInstance.getShops();

setShops(response.data)

  } catch (err) {
    console.error("Erreur lors de la récupération des magasins:", err);
  } finally {
    setIsLoading(false);
  }
};
  const handleShowAddModal = () => {
    setShowAddEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddEditModal(false);
  };

  const handleShowDeleteModal = (id: number) => {
    setSelectedShopId(id);
    setShowDeleteModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedShopId(null);
  };

  const handleDeleteShop = async (id: number) => {
    if (!id) return;
    setIsLoading(true);
    try {
      // const response = await shopServiceInstance.deleteShop(id)
      const deleteResponse = await shopServiceInstance.deleteShop(id)
      console.log(deleteResponse)
      if(deleteResponse.status === 200){

        handleCloseDeleteModal()
        getAllShops()
        _showToast(true, deleteResponse?.data.message, setToastData, toggleShow, 4000)

      }
    } catch (err) {
      console.error('Erreur lors de la suppression du magasin:', err)
      if (err instanceof AxiosError) {
        if (err.status === 403) {
          _expiredSession(
            (success, message, delay) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate
          )
        }
      }
    } finally {
      setIsLoading(false)
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const shopFormData = new FormData()
    shopFormData.append(
      'data',
      JSON.stringify({
        name: formData?.name,
        cover: file && `uploads/shopMiniatures/${formData?.name}/${file?.name}`,
        // cover: file && file.name,
      })
    )
    if (file) {
      shopFormData.append('image', file)
    }
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Chargement',
    }))

    try {
      const response = await shopServiceInstance.addShop(shopFormData)
      if (response.ok) {
        const newShop = {
          id: 56,
          name: formData?.name,
          cover: file ? `uploads/shopMiniatures/${formData?.name}/${file?.name}` : '',
        }

        setShops((prev) => [...prev, newShop])
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 3000,
          icon: 'fa fa-check',
          message: 'Nouveau magasin ajouté avec succès',
        })
        toggleShow()
        getAllShops();
        handleCloseAddModal()
      }
    } catch (error) {
      console.log(error)
      setToastData({
        bg: 'danger',
        position: 'top-end',
        delay: 3000,
        icon: 'fa fa-x-mark',
        message: "Une erreur s'est produite lors de l'ajout",
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

  const modalGenericDeleteProps = { show: showDeleteModal, handleClose: handleCloseDeleteModal, selectedId: selectedShopId, handleDelete: handleDeleteShop, title: 'le magasin', isLoading };

  return (
    <Container fluid className='p-0'>
      {/* <Row className='d-flex justify-content-between align-items-center'>
        <Col>
          <Link to='/tableau-de-bord' className='text-muted'>
            <i className='fa-solid fa-circle-arrow-left fs-3'></i>
          </Link>
        </Col>
        <Col xs={10}>
          <h3 className='py-3'>Gestion des Magasins</h3>
        </Col>
        <Col xs={1}></Col>
      </Row> */}
      <h3 className='py-3'>Gestion des Magasins</h3>
      <Container>
        <Table striped hover responsive='sm' className='shadow'>
          <TableHeader columnsData={columnsData} />
          <tbody>
            {!isLoading && shops?.length > 0 ? (
              <>{shopDisplay(shops)}</>
            ) : (
              <TableLoader lengthTr={5} lengthTd={3} />
            )}
          </tbody>
        </Table>
      </Container>
      <Button variant='primary' className='rounded-pill fab' onClick={handleShowAddModal}>
        <strong>+</strong> <span>Ajouter un magasin</span>
      </Button>
      <ModalAddShop
        modalAddShopProps={{
          showAdd: showAddEditModal,
          handleCloseAdd: handleCloseAddModal,
          handleSubmit: handleSubmit,
          formData: formData,
          setFormData: setFormData,
          setFile: setFile,
          feedBackState: feedBackState,
        }}
      />

      <ModalGenericDelete modalGenericDeleteProps={modalGenericDeleteProps} />
    </Container>
  )
}