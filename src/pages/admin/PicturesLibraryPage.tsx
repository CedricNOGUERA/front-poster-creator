import VariousPicturesServices from '@/services/VariousPicturesServices'
import React from 'react'
import { Card, Container } from 'react-bootstrap'
interface PictureType {
    "id": number
    "name": string
    "src": string
    "value": string
    "createAt": string
}
const API_URL = import.meta.env.VITE_API_URL

export default function PicturesLibraryPage() {

    const [pictures, setPictures] = React.useState<PictureType[]>([])

    React.useEffect(() => {
        getPictures()
    }, [])

    const getPictures = async () => {
        try{
            const response = await VariousPicturesServices.getVariousPictures()
            console.log(response)
            if(response.status === 200){
                setPictures(response?.data)
            }
        }
        catch(error){
            console.log(error)
        }
    }

  return (
    <Container fluid className='p-0'>
      <h3 className='py-3'>Gestion des images</h3>
      <Container className='d-flex flex-wrap align-items-center mt-5 mb-5 gap-4'>
        {pictures.map((pict) => (
          <Card key={pict.id}>
            <Card.Body>
              <img src={API_URL + pict.src} alt={pict.name} width={100} />
            </Card.Body>
          </Card>
        ))}
      </Container>
    </Container>
  )
}
