import { ModalAddPicture, ModalGenericDelete } from '@/components/ui/Modals'
import VariousPicturesServices from '@/services/VariousPicturesServices'
// import userDataStore from '@/stores/userDataStore'
import { PictureType, ToastDataType } from '@/types/DiversType'
import { _getPictures } from '@/utils/apiFunctions'
import { _showToast } from '@/utils/notifications'
import { AxiosError } from 'axios'
import React from 'react'
import { Badge, Button, Card, Container } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom'


interface ContextType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
}

const API_URL = import.meta.env.VITE_API_URL

export default function PicturesLibraryPage() {

    const {toggleShow, setToastData} = useOutletContext<ContextType>()
    // const userLogOut = userDataStore((state) => state.authLogout)

    const [pictures, setPictures] = React.useState<PictureType[]>([])
    const [file, setFile] = React.useState<File | null>(null)
    const [imageName, setImageName] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    
    const [selectedPicture, setSelectedPicture] = React.useState<PictureType>({
      id: 0,
      name: "",
      src: "",
      value: "",
      createdAt: ""
    })
    

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
    setIsLoading(false)

    const valuePicture = imageName.normalize('NFD') // transforme é → e + ́
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-zA-Z0-9]/g, '-') //transforme les espaces en -
    .toLowerCase()
    
    const pictureData = {
      name: imageName,
      value: valuePicture
    }

    const newPictureData = new FormData()
    newPictureData.append('data', JSON.stringify(pictureData))

    if(file){
      newPictureData.append('image', file)
    }

    try {
      const response = await VariousPicturesServices.postPictures(newPictureData)
      console.log(response)

      if(response.status === 201){
        console.log("image ajoutée")
        _showToast(true, "image ajoutée avec succès", setToastData, toggleShow, 4000)

        handleCloseAdd()
        _getPictures(setPictures)
      }

    } catch (error: unknown) {
      console.log(error)
      if(error instanceof AxiosError){
        _showToast(false, error.response?.data.error, setToastData, toggleShow, 4000)
      }

    }
  }
  const deletePicture = async(id: number) => {
    setIsLoading(true)
    
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
          _showToast(false, "Session expirée, reconnectez-vous", setToastData, toggleShow, 5000)
          // userLogOut()
        }else{
          _showToast(false, error.response?.data.message || error.response?.data.error, setToastData, toggleShow, 4000)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }



  const modalAddPictureProps = {
    showAdd, handleCloseAdd, handleSubmit, imageName, setImageName, setFile, file
  }

  const modalGenericDeleteProps = { show: showDelete, handleClose: handleCloseDelete, selectedId: selectedPicture.id, handleDelete: deletePicture, title: "l'image", isLoading }

  return (
    <Container fluid className='p-0'>
      <h3 className='py-3'>Gestion des images</h3>
      <Button onClick={handleShowAdd}>+</Button>
      <Container className='d-flex flex-wrap align-items-center mt-5 mb-5 gap-4'>
        {pictures.map((pict) => (
          <>
          <Card key={pict.id} style={{position: "relative"}}>
            <Card.Body>
              <img src={API_URL + pict.src} alt={pict.name} width={100} />
            </Card.Body>
            <Badge pill bg="secondary" style={{position:"absolute", top: 2, right: 2}}
            onClick={() => {
              handleShowDelete()
              setSelectedPicture(pict)
            }}
            >x</Badge>
          </Card>
          </>
        ))}
      </Container>
      <ModalAddPicture modalAddPictureProps={modalAddPictureProps} />
      <ModalGenericDelete modalGenericDeleteProps={modalGenericDeleteProps} />
    </Container>
  )
}
