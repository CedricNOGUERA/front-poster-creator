import React from 'react'
import useStoreApp from '@/stores/storeApp'
import { ShopType } from '@/types/ShopType'
import { _getAllShops } from '@/utils/apiFunctions'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import shopServiceInstance from '@/services/ShopsServices'
import { useOutletContext } from 'react-router-dom'
import { FeedBackSatateType, ToastDataType } from '@/types/DiversType'
import { _handleFileChange } from '@/utils/functions'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { useNavigate } from 'react-router-dom'


type Props = {
  title: string
}
interface ContextCategorySelectorDragType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  feedBackState: FeedBackSatateType
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
}

const API_URL = import.meta.env.VITE_API_URL

export const ShopSelectorDrag = ({ title }: Props) => {
  /* States
   *******************************************************************************************/
  const navigate = useNavigate()
  const { toggleShow, setToastData, feedBackState, setFeedBackState } =
    useOutletContext<ContextCategorySelectorDragType>()
  const userStoreData = userDataStore((state: UserDataType) => state)
  const userRole = userDataStore((state: UserDataType) => state.role)

  const storeApp = useStoreApp()
  const [shops, setShops] = React.useState<ShopType[]>([])
  const [file, setFile] = React.useState<File | null>(null)
  const [validated, setValidated] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<{[key: string]: string}>({})
  const [formData, setFormData] = React.useState<{
    name: string
    image: string
  }>({
    name: '',
    image: '',
  })

  const [showAdd, setShowAdd] = React.useState(false)
  const handleCloseAdd = () => {
    resetForm()
    setShowAdd(false)}
  const handleShowAdd = () => setShowAdd(true)

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getAllShops(setShops)
     // Redirection si l'utilisateur a le rôle "user"
    if (userRole === 'user') {
      navigate('/generateur-de-bon-plan')
      return
    }
  }, [userRole, navigate])

  /* Functions
   *******************************************************************************************/
  const onHandleShop = (id: number) => {
    storeApp.setShopId(id)
    storeApp.nextStep()
  }

  const resetForm = () => {
    setFieldErrors({})
    setFormData({
      name: '',
      image: '',
    })
  }

  const validateField = (fieldName: string, value: string) => {
    const errors = { ...fieldErrors };
    console.log(errors)
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Le nom est requis';
        } else if (value.trim().length < 2) {
          errors.name = 'Le nom doit contenir au moins 2 caractères';
        } else {
          delete errors.name;
        }
        break;
      case 'image':
        if (!value.trim()) {
          errors.image = 'L\'image est requise';
        } else {
          delete errors.image;
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget;
    
    // Validation du formulaire
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.name.trim() === "") {
      setFeedBackState((prev) => ({
        ...prev,
        isError: true,
        errorMessage: "Veuillez saisir un nom de magasin",
        isLoading: false,
        loadingMessage: "",
      }))
      setValidated(true);
      return;
    }
    setValidated(true);
    const shopFormData = new FormData()
    shopFormData.append(
      'data',
      JSON.stringify({
        name: formData.name,
        cover: file && `uploads/shopMiniatures/${formData.name}/${file.name}`,
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
          name: formData.name,
          cover: file ? `uploads/shopMiniatures/${formData.name}/${file.name}` : '',
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
        handleCloseAdd()
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

  /* Render
   *******************************************************************************************/
  return (
    <>
      <h2 className='fs-4 fw-bold text-primary'>{title}</h2>
      <div className='d-flex flex-wrap justify-content-center align-items-center mt-5 mb-5'>
        {shops
          .filter((shop) =>  {
            if(userStoreData.role === "super_admin"){
              return true
            }else{
              userStoreData.company.some((uc) =>
              uc.idCompany === shop.id)
            }
          
          })
          .map((shop: ShopType) => {
      
          return (
            <div
              key={shop.id}
              className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 px-4'
              onClick={() => onHandleShop(shop.id)}
            >
              <img src={`${API_URL}/${shop.cover}`} alt={shop.name} width={150} />
            </div>
          )
        })}
        {userStoreData.role === 'super_admin' && (
          <div
            className='hover-card mb-3 mx-4 border rounded-1 border-primary p-3 d-flex flex-column justify-content-center align-items-center'
            style={{ width: '200px', height: '183px' }}
            onClick={() => handleShowAdd()}
          >
            <i className={'fa fa-plus-circle text-primary fs-1'}></i>
            <p className='mt-2 text-center fw-bold fs-5 text-primary'>Magasin</p>
          </div>
        )}
      </div>
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className='fa fa-plus-circle text-primary fs-1'></i> &nbsp;Ajouter un nouveau
              magasin
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type='text'
                placeholder='Saissisez le nom du magasin'
                value={formData.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                  validateField('name', e.target.value)
                }}
                onBlur={(e) => validateField('name', e.target.value)}
                required
                isInvalid={validated && !formData.name.trim() || !!fieldErrors.name}
              />
                <Form.Control.Feedback type="invalid">
              {fieldErrors.name || "Veuillez saisir un nom de magasin."}
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label className=''>Ajouter une image</Form.Label>
              <Form.Control
                type='file'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  _handleFileChange(e, setFile)
                }
                required
                isInvalid={validated && !formData.image.trim() || !!fieldErrors.image}
              />
                <Form.Control.Feedback type="invalid">
              {fieldErrors.name || "Une image est requise."}
            </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                handleCloseAdd()
                setFile(null)
                setFormData({
                  name: '',
                  image: '',
                })
              }}
            >
              Annuler
            </Button>
            <Button variant='success' type='submit' disabled={feedBackState.isLoading}>
              {feedBackState.isLoading ? (
                <>
                  <Spinner size='sm' /> {feedBackState.loadingMessage}
                </>
              ) : (
                <span>Ajouter</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
