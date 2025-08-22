import React from 'react'
import { _handleDragStart, _handleDragStartImg, _handleFileChange } from '@/utils/functions'
import { Button, Form, Image, Placeholder } from 'react-bootstrap'
import { FeedBackSatateType, ToastDataType } from '@/types/DiversType'
import { StoreType } from '@/stores/storeApp'
import { ModalDelete } from '../ui/Modals'
import { useOutletContext } from 'react-router-dom'
import { ComponentTypeMulti, HeaderComponentType } from '@/types/ComponentType'
import { _getCategoryPictures, _handleUploadFile } from '@/utils/apiFunctions'



export interface SideBarDataType {
  idShop: number
  category: number
  image: string
}
interface ContextSideBarType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  feedBackState: FeedBackSatateType
  setFeedBackState: React.Dispatch<React.SetStateAction<FeedBackSatateType>>
}

const API_URL = import.meta.env.VITE_API_URL

export default function SideBar({ storeApp, selectedCanvas }: {storeApp: StoreType, selectedCanvas: ComponentTypeMulti[]}) {
  const {toggleShow, setToastData, feedBackState, setFeedBackState} = useOutletContext<ContextSideBarType>()
  /* States
   *******************************************************************************************/

  const shopId = storeApp.shopId
  const categoryId = storeApp.categoryId
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  const [file, setFile] = React.useState<File | null>(null)
  const [sideBarData, setSideBarData] = React.useState<SideBarDataType[]>([])

  const headerBgColor = (selectedCanvas?.[0] as HeaderComponentType)?.backgroundColor 
  const headerPicture = (selectedCanvas?.[0] as HeaderComponentType)?.src

//image modal delete
  const [showDelete, setShowDelete] = React.useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);


React.useEffect(() => {
  _getCategoryPictures(categoryId, setSideBarData, shopId, setFeedBackState)
}, [categoryId, shopId])



  const modalDeleteProps = {
    showDelete,
    handleCloseDelete,
    selectedIndex,
    sideBarData,
    setSideBarData,
    setToastData,
    toggleShow,
    categoryId,
  }

  /* render
  *******************************************************************************************/

  return (
    <>
      <div className='p-4 bg-white border-0 border-end sticky-top'>
        <h4 className='fw-bold text-secondary mb-4'>Générateur d'affiche</h4>
        
        {headerPicture !== null && (
        <div
          className='d-flex align-items-center justify-content-center mb-4 p-2 border rounded '
          style={{
            backgroundColor: headerBgColor,
          }}
        >

            <Image src={API_URL + headerPicture} alt={headerPicture} width={150} />
        </div>
        )}
        {file === null ? (
          <div className=' d-flex align-items-center  justify-content-center mb-4 p-2 border rounded'>
            <Form.Group controlId='formFile' className=''>
              <Form.Label className='mb-0 d-flex align-items-center  justify-content-center pointer'>
                <i className={'fa fa-plus-circle text-success fs-5 me-2'}></i>
                ajouter une image
              </Form.Label>
              <Form.Control
              className=''
                type='file'
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  _handleFileChange(e, setFile)
                }
                hidden
              />
            </Form.Group>
          </div>
        ) : (
          <div className=' d-flex align-items-center  justify-content-center mb-4 p-2 border rounded bg-success text-light pointer'>
            <span
              onClick={() =>
                _handleUploadFile(
                  file,
                  setFile,
                  setSideBarData,
                  categoryId,
                  setToastData,
                  toggleShow,
                  shopId
                )
              }
            >
              Valider ({file.name})
              <i className={'fa fa-check-circle text-light fs-5 ms-2'}></i>
            </span>
          </div>
        )}
        {feedBackState.isLoading ? (
          <>
            <Placeholder as='div' animation='glow'>
              <Placeholder xs={12} as='div' className='mb-2 py-2 rounded' />
            </Placeholder>
            <Placeholder as='div' animation='glow'>
              <Placeholder xs={12} as='div' className='mb-2 py-2 rounded' />
            </Placeholder>
            <Placeholder as='div' animation='glow' className='mb-2'>
              <Placeholder xs={12} as='div' className='mb-2 py-2 rounded' />
            </Placeholder>
          </>
        ) : (
          sideBarData?.map((item: SideBarDataType, indx: number) => {
            if (categoryId === item.category) {
              return (
                <div
                  key={indx}
                  draggable
                  onMouseEnter={() => setHoveredIndex(indx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onDragStart={(e) => {
                    
                    _handleDragStartImg(e, 'image', item.image)}}
                    
                  className={`relative-zone mb-2 p-2 border rounded bg-green-100 move text-center`}
                >
                  <Image src={API_URL + item.image} alt={item.image} width={50} className='move' />
                  {hoveredIndex === indx && (
                    <Button
                      variant='light'
                      className='rounded-circle'
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        zIndex: 20,
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        lineHeight: '1',
                      }}
                      onClick={() => {
                        handleShowDelete()
                        setSelectedIndex(indx)
                      }}
                      title='Supprimer'
                    >
                      <i className='fa-solid fa-xmark'></i>
                    </Button>
                  )}
                </div>
              )
            }
          })
        )}
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'text')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une zone de texte"
        >
          Zone de texte
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'enableText')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une zone de texte"
        >
          Zone de texte non modifiable
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'group')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une zone de texte"
        >
          Group
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'price')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une zone de texte"
        >
          Prix principal
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'number')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une zone de texte"
        >
          Zone numérique
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'horizontalLine')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une ligne horizontale"
        >
          Ligne horizontale
        </div>
        <div
          draggable
          onDragStart={(e) => _handleDragStart(e, 'verticalLine')}
          className='mb-2 p-2 border rounded move text-center'
          title="glisser et déposer dans l'encadré pour ajouter une ligne verticale"
        >
          Ligne verticale
        </div>
      </div>

      <ModalDelete modalDeleteProps={modalDeleteProps} />
    </>
  )
}
