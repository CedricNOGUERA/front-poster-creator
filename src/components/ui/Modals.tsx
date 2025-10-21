import { _handleFileChange } from '@/utils/functions'
import React, { FormEvent } from 'react'
import { Alert, Button, Dropdown, Form, Image, Modal, Spinner } from 'react-bootstrap'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { TagPicker } from 'rsuite'
import { RiErrorWarningLine } from 'react-icons/ri'

import {
  ContextModalValidateModelType,
  ModalAddCategoryType,
  ModalDeleteType,
  ModalValidateModelType,
  ModalGenericDeletePropsType,
  ModalAddShopType,
  ModalAddEditCategoryType,
  ModalUpdateModelType,
  ModalAddPictureType,
  ModalEditModelType,
} from '@/types/ModalType'
import { ShopType } from '@/types/ShopType'
import { HeaderComponentType, BackgroundComponentType } from '@/types/ComponentType'
import { _getCategoriesPaginated, _getTemplates, _handleDeleteImg, _patchTemplate } from '@/utils/apiFunctions'
import fontAwesomeIcons from '../../data/fontAwesomeIcons.json'
import { TemplateType } from '@/types/TemplatesType'
import { CategoriesPaginatedType, CategoriesType } from '@/types/CategoriesType'
import categoriesServiceInstance from '@/services/CategoriesServices'
import { AxiosError } from 'axios'
import { _expiredSession, _showToast } from '@/utils/notifications'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { FaEdit } from 'react-icons/fa'
const API_URL = import.meta.env.VITE_API_URL

export function ModalDelete({ modalDeleteProps }: { modalDeleteProps: ModalDeleteType }) {
  const {
    showDelete,
    handleCloseDelete,
    selectedIndex,
    sideBarData,
    setSideBarData,
    setToastData,
    toggleShow,
    categoryId,
  } = modalDeleteProps
  return (
    <Modal show={showDelete} onHide={handleCloseDelete}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCircleXmark className='me-2 text-danger' />Suppression d'image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Etes sûr de vouloir supprimer cette image ?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseDelete}>
          Annuler
        </Button>
        <Button
          variant='danger'
          onClick={() => {
            _handleDeleteImg(
              selectedIndex,
              sideBarData,
              setSideBarData,
              setToastData,
              toggleShow,
              categoryId
            )
            handleCloseDelete()
          }}
        >
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function ModalValidateModel({
  modalValidateModelProps,
}: {
  modalValidateModelProps: ModalValidateModelType
}) {
  const { showValidateModel, handleCloseValidateModel, addModel, imageName, setImageName, template, setTemplate,  isErrorModel, hasModel } =
    modalValidateModelProps
  const { feedBackState } = useOutletContext<ContextModalValidateModelType>()

  const [isTemplate, setIsTemplate] = React.useState<boolean>(false)

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    _getTemplates(setTemplate)
  }, [setTemplate])
  
  React.useEffect(() => {
    setIsTemplate(template.some((item) => item.name === imageName))
  }, [imageName, template])
console.log(isTemplate)
  return (
    <Modal show={showValidateModel} onHide={handleCloseValidateModel}>
      <Modal.Header closeButton>
        <Modal.Title className='d-flex align-items-center'>
          <FaCircleCheck className='me-2 text-success' />
          Validation du model
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Voulez-vous {hasModel  ? "modifier" : "valider"} ce model ?
        <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
          <Form.Label>{hasModel ? "Nom du modèle" : "Ajouter un nom au model"}</Form.Label>
          <Form.Control
            type='text'
            placeholder='Saisissez un nom'
            value={imageName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
          <Form.Label>Model existant</Form.Label>
          <Form.Select
            value={imageName || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const templateName = e.target.value
              setImageName(templateName)
            }}
          >
            <option value=''>Sélectionnez un model existant</option>
            {template.map((template: TemplateType, index: number) => (
              <option key={index} value={template.name}>
                {template.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {isErrorModel && (
          <Alert variant='danger'>
            <i className='fa fa-circle-xmark me-2 text-danger'></i>
            Vous devez remplir un de ces champs
          </Alert>
        )}
        {hasModel && isTemplate && (
          <Alert variant='danger'>
            <i className='fa fa-circle-xmark me-2 text-danger'></i>
            <small>Attention : Le modèle existant sera remplacé définitivement</small>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseValidateModel}>
          Annuler
        </Button>
        <Button
          variant='success'
          onClick={() => {
            addModel(imageName)
          }}
        >
          {feedBackState.isLoading ? (
            <>
              <Spinner size='sm' /> {feedBackState.loadingMessage}
            </>
          ) : (
            <span>Valider</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function ModalUpdateModel({
  modalUpdateModelProps,
}: {
  modalUpdateModelProps: ModalUpdateModelType
}) {
  const { showUpdateModel, handleCloseUpdateModel, updateModel } = modalUpdateModelProps
  const { feedBackState } = useOutletContext<ContextModalValidateModelType>()

  return (
    <Modal show={showUpdateModel} onHide={handleCloseUpdateModel}>
      <Modal.Header closeButton>
        <Modal.Title className='d-flex align-items-center'>
          <FaEdit className='me-2 text-success' />Validation du model
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Voulez-vous valider la modification ce model ?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseUpdateModel}>
          Annuler
        </Button>
        <Button
          variant='success'
          onClick={() => {
            updateModel()
          }}
        >
          {feedBackState.isLoading ? (
            <>
              <Spinner size='sm' /> {feedBackState.loadingMessage}
            </>
          ) : (
            <span>Valider</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function ModalAddEditModel({
  modalAddEditModelProps,
}: {
  modalAddEditModelProps: ModalEditModelType
}) {
  const { showAddEditModal, handleCloseAddEditModal, selectedModel, setSelectedModel, shopList } = modalAddEditModelProps
  const { feedBackState, setFeedBackState,  setToastData, toggleShow } = useOutletContext<ContextModalValidateModelType>()

  const onPatchSubmit = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    const data = {
      name: selectedModel.name,
      image: selectedModel.image,
      categoryId: selectedModel.categoryId,
      shopIds: selectedModel.shopIds,
    }

    try{
      _patchTemplate(selectedModel.id, data, setFeedBackState, handleCloseAddEditModal, setToastData, toggleShow)
    }catch(error){
      console.log(error)
    }
  
  }

  return (
    <Modal show={showAddEditModal} onHide={handleCloseAddEditModal}>
        <Form onSubmit={onPatchSubmit}>
      <Modal.Header closeButton>
        <Modal.Title className='d-flex align-items-center'>
          <FaEdit className='me-2 text-success' />Modififer ce model
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='mb-3' controlId='modelName'>
          <Form.Label>Nom du model</Form.Label>

          <Form.Control
          type="text"
          value={selectedModel?.name || ""}
          onChange={(e) => setSelectedModel((prev) => ({
            ...prev,
            name: e.target.value
          }))}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='shops'>
          <Form.Label>Magasins</Form.Label>
          <TagPicker
              data={shopList}
              style={{ width: '100%' }}
              placeholder='Sélectionnez un ou plusieurs magasins'
              value={selectedModel?.shopIds}
              onChange={(newValues: string[]) => {
                const numericIds = newValues.map((val) => parseInt(val, 10))
                setSelectedModel((prev) => ({
                  ...prev,
                  shopIds: numericIds,
                }))
              }}
            />
        </Form.Group>
        </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseAddEditModal}>
          Annuler
        </Button>
        <Button
          variant='success'
          type="submit"
          // onClick={() => {
          //   const data = {
          //     name: selectedModel.name,
          //     image: selectedModel.image,
          //     categoryId: selectedModel.categoryId,
          //     shopIds: selectedModel.shopIds,
          //   }
          //   _patchTemplate(selectedModel.id, data, setFeedBackState, handleCloseAddEditModal)
          // }}
        >
          {feedBackState?.isLoading ? (
            <>
              <Spinner size='sm' /> {feedBackState?.loadingMessage}
            </>
          ) : (
            <span>Valider</span>
          )}
        </Button>
      </Modal.Footer>
          </Form>
    </Modal>
  )
}

export function ModalAddCategory({
  modalAddCategoryProps,
}: {
  modalAddCategoryProps: ModalAddCategoryType
}) {
  const {
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
    fieldErrors,
    validateField,
  } = modalAddCategoryProps

  const shopList = shops.map((item: ShopType) => ({
    label: item.name,
    value: String(item.id),
  }))

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='fa fa-plus-circle text-primary fs-1'></i> &nbsp;Ajouter une nouvelle
            catégorie
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='categoryName'>
            <Form.Label>
              Nom<span className='text-danger'>*</span>
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='Saissisez le nom de la catégorie'
              value={formData.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
                validateField('name', e.target.value)
              }}
              onBlur={(e) => validateField('name', e.target.value)}
              required
              isInvalid={(validated && !formData.name.trim()) || !!fieldErrors.name}
            />
            <Form.Control.Feedback type='invalid'>
              {fieldErrors.name || 'Veuillez saisir un nom de catégorie.'}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3' controlId='categoryIcon'>
            <Form.Label>Icône</Form.Label>
            <Dropdown>
              <Dropdown.Toggle
                variant='transparente'
                id='catIcon'
                className='w-100 text-start border'
              >
                {formData.icon && formData.icon.value ? (
                  <>
                    <i className={formData.icon.value + ' fs-5 text-primary'}></i>
                    <span className='ms-2'>{formData.icon.name}</span>
                  </>
                ) : (
                  'Sélectionnez une icone'
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className='w-100'>
                <Dropdown.Item
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, icon: { name: '', value: '' } }))
                  }
                >
                  Annuler
                </Dropdown.Item>
                {fontAwesomeIcons.map((icon) => (
                  <Dropdown.Item
                    key={icon.name}
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  >
                    <i className={icon.value + ' fs-5 me-2 text-primary'}></i>
                    <span style={{ fontSize: 15 }}>{icon.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label className=''>Ajouter une image(header)</Form.Label>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setFile)
              }
            />
          </Form.Group>
          <Form.Group controlId='formFileRglt' className='mb-3'>
            <Form.Label className=''>
              Ajouter une image (header) (<b>mode réglette</b>)
            </Form.Label>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setImgRglt)
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='backgroundColorHeader'>
            <Form.Label>Couleur de fond (entête)</Form.Label>
            <Form.Control
              type='color'
              className='w-100'
              value={formData.backgroundColorHeader || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  backgroundColorHeader: e.target.value,
                }))
                validateField('backgroundColorHeader', e.target.value)
              }}
              isInvalid={!!fieldErrors.backgroundColorHeader}
            />
            {fieldErrors.backgroundColorHeader && (
              <Form.Control.Feedback type='invalid'>
                {fieldErrors.backgroundColorHeader}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='backgroundColorBody'>
            <Form.Label>Couleur de fond (corps)</Form.Label>
            <Form.Control
              type='color'
              className='w-100'
              value={formData.backgroundColorBody || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({
                  ...prev,
                  backgroundColorBody: e.target.value,
                }))
                validateField('backgroundColorBody', e.target.value)
              }}
              isInvalid={!!fieldErrors.backgroundColorBody}
            />
            {fieldErrors.backgroundColorBody && (
              <Form.Control.Feedback type='invalid'>
                {fieldErrors.backgroundColorBody}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='categoryShops'>
            <Form.Label>
              Magasins<span className='text-danger'>*</span>
            </Form.Label>
            <TagPicker
              data={shopList}
              style={{ width: '100%' }}
              placeholder='Sélectionnez le ou les magasins'
              onChange={(newValues: string[]) => {
                const numericIds = newValues.map((val) => parseInt(val, 10))
                setFormData((prev) => ({
                  ...prev,
                  shopIds: numericIds,
                }))
              }}
            />
            {validated && formData.shopIds.length === 0 && (
              <div className='invalid-feedback d-block'>
                Veuillez sélectionner au moins un magasin.
              </div>
            )}
          </Form.Group>

          {/* Message d'erreur global */}
          {feedBackState.isError && feedBackState.errorMessage && (
            <div className='alert alert-danger mt-3'>
              <i className='fa fa-times-circle me-2'></i>
              <small>{feedBackState.errorMessage}</small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              // setFormData({
              //   name: '',
              //   icon: '',
              //   image: '',
              //   imageRglt: '',
              //   backgroundColorHeader: '#ff0000',
              //   backgroundColorBody: '#ffea00',
              //   shopIds: [],
              //   canvas: [],
              // })
              // resetForm()
              handleCloseAdd()
            }}
          >
            Annuler
          </Button>
          <Button variant='success' disabled={feedBackState.isLoading} type='submit'>
            {feedBackState.isLoading && (
              <Spinner size='sm' animation='border' role='status' aria-hidden='true' />
            )}
            &nbsp;{feedBackState.isLoading ? feedBackState.loadingMessage : 'Valider'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export function ModalAddEditCategory({
  modalAddEditCategoryProps,
}: {
  modalAddEditCategoryProps: ModalAddEditCategoryType
}) {
  const {
    showAdd,
    handleCloseAdd,
    handleSubmit,
    formData,
    setFormData,
    setFile,
    setImgRglt,
    feedBackState,
    shopData,
  } = modalAddEditCategoryProps

  const shopList = shopData.map((item: ShopType) => ({
    label: item.name,
    value: String(item.id),
  }))

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className='text-primary'>
            <i className='fa fa-pencil '></i> Modifier la catégorie
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Saissisez le nom de la catégorie'
              value={formData?.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Icone</Form.Label>
            <Dropdown>
              <Dropdown.Toggle
                variant='transparente'
                id='catIcon'
                className='w-100 text-start border'
              >
                {formData.icon && formData.icon.value ? (
                  <>
                    <i className={formData.icon.value + ' fs-5 text-primary'}></i>
                    <span className='ms-2'>{formData.icon.name}</span>
                  </>
                ) : (
                  'Sélectionnez une icone'
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className='w-100'>
                <Dropdown.Item
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, icon: { name: '', value: '' } }))
                  }
                >
                  Annuler
                </Dropdown.Item>
                {fontAwesomeIcons.map((icon) => (
                  <Dropdown.Item
                    key={icon.name}
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  >
                    <i className={icon.value + ' fs-5 me-2 text-primary'}></i>
                    <span style={{ fontSize: 15 }}>{icon.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {/* <Form.Control
              type='text'
              placeholder="Saisissez le nom de l'icone"
              value={formData?.icon.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  icon: e.target.value,
                }))
              }
              required
            /> */}
          </Form.Group>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label className=''>
              Image actuelle
              <span className='bg-secondary ms-2 p-2'>
                {formData?.image !== null ? (

                  <Image
                  src={API_URL + formData?.image || 'no-picture'}
                  alt={formData?.name || 'no-picture'}
                  width={100}
                  />
                ) : (
                  <span className='text-light'>Aucune image</span>
                )}
              </span>
            </Form.Label>
            <Form.Control
              type='file'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setFile)
              }
            />
          </Form.Group>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label className=''>
              Image actuelle (<b>mode réglette</b>)
              <span className='bg-secondary ms-2 p-2'>
                {(() => {
                  const firstItem = formData?.canvas?.[0]
                  if (firstItem && firstItem.type === 'header') {
                    const headerItem = firstItem as HeaderComponentType
                    if (headerItem.srcRglt) {
                      return (
                        <Image
                          src={API_URL + headerItem.srcRglt}
                          alt={formData.name || 'Header Reglette'}
                          width={20}
                        />
                      )
                    }
                  }
                  return <span className='text-light'>Aucune image réglette</span>
                })()}
              </span>
            </Form.Label>
            <Form.Control
              type='file'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setImgRglt)
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='bg-color-header'>
            <Form.Label>Couleur de fond (entête)</Form.Label>
            <Form.Control
              type='color'
              className='w-100'
              value={
                formData?.canvas?.[0] &&
                (formData.canvas[0].type === 'header' ||
                  formData.canvas[0].type === 'background-color')
                  ? (formData.canvas[0] as HeaderComponentType | BackgroundComponentType)
                      .backgroundColor
                  : '#000000'
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prevData) => {
                  const newCanvas = prevData.canvas.map((item, index) => {
                    if (
                      index === 0 &&
                      (item.type === 'header' || item.type === 'background-color')
                    ) {
                      return { ...item, backgroundColor: e.target.value } as
                        | HeaderComponentType
                        | BackgroundComponentType
                    }
                    return item
                  })
                  return {
                    ...prevData,
                    canvas: newCanvas,
                    backgroundColorHeader:
                      prevData.canvas?.[0]?.type === 'header' ||
                      (prevData.canvas?.[0]?.type === 'background-color' && e.target.value),
                  }
                })
              }}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='bg-color-body'>
            <Form.Label>Couleur de fond (corps)</Form.Label>
            <Form.Control
              type='color'
              className='w-100'
              value={
                formData?.canvas?.[1] && formData.canvas[1].type === 'background-color'
                  ? (formData.canvas[1] as BackgroundComponentType).backgroundColor
                  : '#000000'
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prevData) => {
                  const newCanvas = prevData.canvas.map((item, index) => {
                    if (index === 1 && item.type === 'background-color') {
                      return {
                        ...item,
                        backgroundColor: e.target.value,
                      } as BackgroundComponentType
                    }
                    return item
                  })
                  return {
                    ...prevData,
                    canvas: newCanvas,
                    backgroundColorBody:
                      prevData.canvas?.[1]?.type === 'background-color' && e.target.value,
                  }
                })
              }}
            />
          </Form.Group>
          <Form.Label>Magasins</Form.Label>
          <TagPicker
            data={shopList}
            value={formData?.shopIds?.map(id => String(id))}
            style={{ width: '100%' }}
            placeholder='Sélectionnez le ou les magasins'
            onChange={(value) => {
              // Convertir le tableau de chaînes en tableau de nombres
              const numericIds = value ? value.map((id: string) => parseInt(id, 10)) : []
        
              setFormData((prev) => ({
                ...prev,
                shopIds: numericIds,
              }))
            }}
          />
        </Modal.Body>
        <Modal.Body className='pt-0'>
          <Alert variant='danger' className='text-danger d-flex align-items-center mb-0'>
            <RiErrorWarningLine className='fs-5 me-2' />
            <small>Tous les modèles associés à cette catégorie seront modifiés</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setFormData({
                name: '',
                icon: { name: '', value: '' },
                image: '',
                imageRglt: '',
                // backgroundColorHeader: '#ff0000',
                // backgroundColorBody: '#ffea00',
                shopIds: [],
                canvasId: 0,
                canvas: [],
              })
              handleCloseAdd()
            }}
          >
            Annuler
          </Button>
          <Button variant='success' disabled={feedBackState.isLoading} type='submit'>
            {feedBackState.isLoading && (
              <Spinner size='sm' animation='border' role='status' aria-hidden='true' />
            )}
            &nbsp;{feedBackState.isLoading ? feedBackState.loadingMessage : 'Valider'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

interface ModalDuplicateCategoryType {
  showDuplicate: boolean
  handleCloseDuplicate: () => void
  selectedCategory: CategoriesType
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoriesType>>
  setCategoriesPaginated: React.Dispatch<React.SetStateAction<CategoriesPaginatedType>>
  page: number 
  limit: number
}
export function ModalDuplicateCategory({
  modalDuplicateCategoryProps,
}: {
  modalDuplicateCategoryProps: ModalDuplicateCategoryType
}) {
  const { feedBackState, setFeedBackState,  setToastData, toggleShow } = useOutletContext<ContextModalValidateModelType>()
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const {showDuplicate, handleCloseDuplicate, selectedCategory, setSelectedCategory, setCategoriesPaginated, page, limit} = modalDuplicateCategoryProps
  const [newName, setNewName] = React.useState<string>("")
  const navigate = useNavigate()

  const handleDuplicate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = selectedCategory.id
    setFeedBackState((prev)=> ({
      ...prev,
      isLoading: true,
      loadingMessage: "chargement..."
    }))



    try{
      const response = await categoriesServiceInstance.duplicateCategory(id, newName)

      if(response.status === 201){
        _getCategoriesPaginated(setCategoriesPaginated, setToastData, toggleShow, setFeedBackState, page, limit)
        handleCloseDuplicate()
        setToastData({
          bg: 'success',
          position: 'top-end',
          delay: 4000,
          icon: 'fa fa-check-circle',
          message: response.data.message ? response.data.message : 'Catégorie dupliquée avec succès',
        })
        toggleShow()
      }
    }catch(error: unknown){
      console.log(error)
      if(error instanceof AxiosError){
        if(error.response && error.response.status === 401 && error.response.data.code === "TOKEN_EXPIRED"){
          _expiredSession(
            (success, message, delay) => _showToast(success, message, setToastData, toggleShow, delay),
            userLogOut,
            navigate
          )
        }else{
          setToastData({
          bg: 'danger',
          position: 'top-end',
          delay: 7000,
          icon: 'fa fa-xmark-circle',
          message: error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message === 'Network Error'
            ? 'Une erreur serveur est survenue, vérifier votre connexion internet. Si le problème persiste contactez votre administrateur'
            : 'Une erreur est survenue lors de la duplication',
          })
          toggleShow()
        }
      }
    }finally{
      setFeedBackState((prev)=> ({
        ...prev,
        isLoading: false,
        loadingMessage: ""
      }))
    }
  }


  return (
    <Modal show={showDuplicate} onHide={handleCloseDuplicate}>
      <Form onSubmit={handleDuplicate}>
        <Modal.Header closeButton>
          <Modal.Title className='text-primary'>
            <i className='fa fa-pencil '></i> Dupliquez la catégorie
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Saissisez le nouveau nom de la catégorie'
              value={newName || ''}
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)
              }
              required
            />
          </Form.Group>
        </Modal.Body>
        {newName === selectedCategory.name && (
          <Modal.Body className='pt-0'>
            <Alert variant='danger' className='text-danger d-flex align-items-center mb-0'>
              <RiErrorWarningLine className='fs-5 me-2' />
              <small>Le nom de nouvelle catégorie doit différent de l'ancienne</small>
            </Alert>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setSelectedCategory({} as CategoriesType)
              handleCloseDuplicate()
            }}
          >
            Annuler
          </Button>
          <Button
            variant='success'
            // disabled={feedBackState.isLoading}
            disabled={feedBackState.isLoading || newName === selectedCategory.name}
            type='submit'
          >
            {feedBackState.isLoading ? (
              <>
                <Spinner size='sm' animation='border' role='status' aria-hidden='true' />{' '}
                {feedBackState.loadingMessage}
              </>
            ) : (
              <span>valider</span>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export function ModalAddShop({ modalAddShopProps }: { modalAddShopProps: ModalAddShopType }) {
  const {
    showAdd,
    handleCloseAdd,
    handleSubmit,
    formData,
    setFormData,
    setFile,
    feedBackState,
  } = modalAddShopProps

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className='text-primary'>
            <i className='fa fa-shop fs-'></i> &nbsp;Ajouter un nouveau magasin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Saissisez le nom du magasin'
              value={formData?.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </Form.Group>

          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label className=''>Ajouter une image</Form.Label>
            <Form.Control
              type='file'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setFile)
              }
            />
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
          <Button
            variant='success'
            type='submit'
            disabled={feedBackState.isLoading}
            // onClick={handleSubmit}
          >
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
  )
}

export function ModalGenericDelete({
  modalGenericDeleteProps,
}: {
  modalGenericDeleteProps: ModalGenericDeletePropsType
}) {
  const { show, handleClose, selectedId, handleDelete, title, isLoading } =
    modalGenericDeleteProps

  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCircleXmark className='me-2 text-danger' />Supprimer {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Etes sûr de vouloir supprimer {title} ?</Modal.Body>
      {title === 'la catégorie' && (
        <Modal.Body className='pt-0'>
          <Alert variant='danger' className='text-danger d-flex align-items-center mb-0'>
            <RiErrorWarningLine className='fs-5 me-2' />
            <small>Tous les modèles associés à cette catégorie seront effacés</small>
          </Alert>
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Annuler
        </Button>
        <Button
          variant='danger'
          onClick={() => {
            if (selectedId) {
              handleDelete(selectedId)
              handleClose()
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size='sm' animation='border' variant='light' /> : 'Valider'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export function ModalAddPicture({
  modalAddPictureProps,
}: {
  modalAddPictureProps: ModalAddPictureType
}) {
  const {
    showAdd, handleCloseAdd, handleSubmit, imageName, setImageName, setFile, feedBackState
  } = modalAddPictureProps



  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Form 
      // noValidate validated={validated} 
      onSubmit={handleSubmit}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='fa fa-plus-circle text-primary fs-1'></i> &nbsp;Ajouter une nouvelle
            image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='categoryName'>
            <Form.Label>
              Nom<span className='text-danger'>*</span>
            </Form.Label>
            <Form.Control
              type='text'
              placeholder="Saissisez le nom de l'image"
              value={imageName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setImageName(e.target.value)
                // validateField('name', e.target.value)
              }}
              // onBlur={(e) => validateField('name', e.target.value)}
              required
              // isInvalid={(validated && !formData.name.trim()) || !!fieldErrors.name}
            />
            {/* <Form.Control.Feedback type='invalid'>
              {fieldErrors.name || 'Veuillez saisir un nom de catégorie.'}
            </Form.Control.Feedback> */}
          </Form.Group>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label className=''>Ajouter une image(header)</Form.Label>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                _handleFileChange(e, setFile)
              }
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setImageName("")
              handleCloseAdd()
            }}
          >
            Annuler
          </Button>
          <Button variant='success' 
          disabled={feedBackState.isLoading} 
          type='submit'>
            {feedBackState.isLoading && (
              <Spinner size='sm' animation='border' role='status' aria-hidden='true' />
            )}
            &nbsp;{feedBackState.isLoading ? feedBackState.loadingMessage : 'Valider'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
