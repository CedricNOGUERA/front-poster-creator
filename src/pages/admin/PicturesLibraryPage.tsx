import { ModalAddPicture, ModalGenericDelete } from '@/components/ui/Modals'
import VariousPicturesServices from '@/services/VariousPicturesServices'
import userDataStore from '@/stores/userDataStore'
// import userDataStore from '@/stores/userDataStore'
import { PictureType, ToastDataType } from '@/types/DiversType'
import { _getPictures } from '@/utils/apiFunctions'
import { _expiredSession, _showToast } from '@/utils/notifications'
import { AxiosError } from 'axios'
import React from 'react'
import { Badge, Button, ButtonGroup, Card, Container } from 'react-bootstrap'
import { useNavigate, useOutletContext } from 'react-router-dom'


interface ContextType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
}
interface feedBackType {
  isLoading: boolean
  loadingMessage: string
}

const API_URL = import.meta.env.VITE_API_URL

export default function PicturesLibraryPage() {

    const {toggleShow, setToastData} = useOutletContext<ContextType>()
    const userLogOut = userDataStore((state) => state.authLogout)
    const navigate = useNavigate()

    const [pictures, setPictures] = React.useState<PictureType[]>([])
    const [file, setFile] = React.useState<File | null>(null)
    const [imageName, setImageName] = React.useState<string>("")
    // const [isLoading, setIsLoading] = React.useState<boolean>(false);
    
    const [selectedPicture, setSelectedPicture] = React.useState<PictureType>({
      id: 0,
      name: "",
      src: "",
      value: "",
      createdAt: ""
    })
    const [feedBackState, setfeedBackState] = React.useState<feedBackType>({
      isLoading: false,
      loadingMessage: "",
    });
    

    const [showAdd, setShowAdd] = React.useState(false)
    const handleCloseAdd = () => {
      setShowAdd(false)
    }
    const handleShowAdd = () => setShowAdd(true)

    const [showDelete, setShowDelete] = React.useState(false)
    const handleCloseDelete = () => {
      setShowDelete(false)
    }
    const handleShowDelete = () => setShowDelete(true)

    React.useEffect(() => {
        _getPictures(setPictures)
    }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // setIsLoading(false)
    setfeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement"
    }))

    const valuePicture = imageName
      .normalize('NFD') // transforme é → e + ́
      .replace(/[\u0300-\u036f]/g, '') // retire les accents
      .replace(/[^a-zA-Z0-9]/g, '-') //transforme les espaces en -
      .toLowerCase()

    const pictureData = {
      name: imageName,
      value: valuePicture,
    }

    const newPictureData = new FormData()
    newPictureData.append('data', JSON.stringify(pictureData))

    if (file) {
      newPictureData.append('image', file)
    }

    try {
      const response = await VariousPicturesServices.postPictures(newPictureData)
      console.log(response)

      if (response.status === 201) {
        console.log('image ajoutée')
        _showToast(true, 'image ajoutée avec succès', setToastData, toggleShow, 4000)
        handleCloseAdd()
        _getPictures(setPictures)
      }
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof AxiosError) {
        if (error.status === 401 && error.response?.data.code === 'TOKEN_EXPIRED') {
          _expiredSession(
            (success: boolean, message: string, delay: number) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate
          )
        }
      }
    }finally{
      setfeedBackState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }

  const deletePicture = async(id: number) => {
    setfeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: "Chargement"
    }))
    
    try {
      const response = await VariousPicturesServices.deletePicture(id)
      console.log(response)

      if(response.status === 200){
        console.log("image supprimée")
        _showToast(true, "Image supprimée avec succès", setToastData, toggleShow, 4000)
        handleCloseDelete()
        _getPictures(setPictures)
      }
    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        if(error.status === 401 && error.response?.data.code === "TOKEN_EXPIRED"){
          _expiredSession(
            (success: boolean, message: string, delay: number) =>
              _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate
          )
        }else{
          _showToast(false, error.response?.data.message || error.response?.data.error, setToastData, toggleShow, 4000)
        }
      }
    } finally {
      setfeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: ""
      }))
    }
  }



  const modalAddPictureProps = {
    showAdd, handleCloseAdd, handleSubmit, imageName, setImageName, setFile, file, feedBackState
  }

  const modalGenericDeleteProps = { show: showDelete, handleClose: handleCloseDelete, selectedId: selectedPicture.id, handleDelete: deletePicture, title: "l'image", isLoading: feedBackState.isLoading }

  return (
    <Container fluid className='p-0'>
      <h3 className='py-3'>Gestion des images</h3>
      <Container className='text-end'>
        <ButtonGroup >
        <Button onClick={handleShowAdd}  >
          <i className='fas fa-circle-plus'></i>
        </Button>
        <Button onClick={handleShowAdd} >
          ajouter une image
        </Button>
        </ButtonGroup>
      </Container>
      <Container className='d-flex flex-wrap align-items-center mt-5 mb-5 gap-4'>
        {pictures.map((pict) => (
            <Card key={pict.id} style={{ position: 'relative' }} className='hovered-display'>
              <Card.Body>
                <img src={API_URL + pict.src} alt={pict.name} width={100} />
              </Card.Body>
              <Badge
                pill
                bg='secondary'
                style={{ position: 'absolute', top: -10, right: -10 }}
                className='delete-badge'
                onClick={() => {
                  handleShowDelete()
                  setSelectedPicture(pict)
                }}
              >
                <i className='fas fa-xmark'></i>
              </Badge>
            </Card>
        ))}
      </Container>
      <ModalAddPicture modalAddPictureProps={modalAddPictureProps} />
      <ModalGenericDelete modalGenericDeleteProps={modalGenericDeleteProps} />
    </Container>
  )
}
