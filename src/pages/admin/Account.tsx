import DynamicIcon from '@/components/ui/DynamicIcon'
import UsersServices from '@/services/UsersServices'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { ToastDataType } from '@/types/DiversType'
import { UserType } from '@/types/UserType'
import { _expiredSession, _showToast } from '@/utils/notifications'
import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap'
import { FaCircleArrowLeft, FaCircleXmark } from 'react-icons/fa6'
import { useNavigate, useOutletContext } from 'react-router-dom'

interface ContextCategorySelectorDragType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
}

const Profile: React.FC = () => {
  const { toggleShow, setToastData } = useOutletContext<ContextCategorySelectorDragType>()

  const userStoreData = userDataStore((state: UserDataType) => state)
  const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: userStoreData.name,
    email: userStoreData.email,
    store: userStoreData.company,
    role: userStoreData.role,
    password: ""
  })
  const [feedBackState, setFeedBackState] = React.useState({
    isLoading: false,
    loadingMessage: '',
    isError: false,
    errorMessage: '',
  })
  const [errorPass, setErrorPass] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPass(false)
    setFeedBackState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Chargement',
    }))
  
    const regexVerification = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/;
    const passwordValidation = regexVerification.test(formData.password)

    if(!passwordValidation){
      setErrorPass(true)
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
      }))
    
      return false
    }

  try{
    const userId = userStoreData.id
    const updatePassword: Partial<UserType> = { "password": formData.password }
    const response = await UsersServices.updateUser(userId, updatePassword)

      if(response.ok){
        setErrorPass(false)
        const message  = "Mot de passe mis à jour avec succès"
        _showToast(true, message, setToastData, toggleShow, 4000)
      }else if (!response.ok && response.status === 403) {
        _expiredSession(
          (success, message, delay) => _showToast(success, message, setToastData, toggleShow, delay),
          userLogOut,
          navigate
      )
    
  }
    }catch(error){
      console.log(error)
      const message  = "Une erreur s'est produite lors de la mise à jour du mot de passe"
        _showToast(true, message, setToastData, toggleShow, 4000)
    }finally{
      setFeedBackState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
      }))
    }

  }

  const handleBack = () => {
    navigate('/editeur-de-bon-plan')
  }

  return (
    <div className='w-100 vh-100 pt-4' style={{}}>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} md={8} lg={6}>
            <div className='d-flex align-items-center mb-4'>
              <Button
                variant='link'
                className='p-0 me-3 text-dark'
                onClick={handleBack}
                style={{ textDecoration: 'none' }}
              >
                <FaCircleArrowLeft className='fs-3' />
              </Button>
              <h2 className='mb-0 fw-bold text-dark'>Profil</h2>
            </div>
            <Card
              className='shadow-lg border-0'
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Card.Body className='p-4'>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-3 text-start'>
                    <Form.Label className='fw-semibold text-dark'>Prénom</Form.Label>
                    <Form.Control
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='Entrez votre prénom'
                      style={{
                        padding: '12px 16px',
                        fontSize: '16px',
                      }}
                      className='shadow-sm border-2'
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className='mb-3 text-start'>
                    <Form.Label className='fw-semibold text-dark'>Email</Form.Label>
                    <Form.Control
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='Entrez votre email'
                      style={{
                        padding: '12px 16px',
                        fontSize: '16px',
                      }}
                      className='shadow-sm border-2'
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className='mb-4 text-start'>
                    <Form.Label className='fw-semibold text-dark'>
                      Mot de passe<span className='text-danger'>*</span>
                    </Form.Label>
                    <InputGroup className='mb-3'>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='Entrez votre mot de passe'
                        style={{
                          padding: '12px 16px',
                          fontSize: '16px',
                        }}
                        className='shadow-sm border-2'
                      />
                      <InputGroup.Text
                        id='eyeOrNot'
                        className='bg-transparent border-2 border-start-0'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <DynamicIcon iconKey={!showPassword ? 'fa-regular eye-slash' : 'fa-regular eye'} className='text-secondary' size={22} />
                      </InputGroup.Text>
                    </InputGroup>
                    {errorPass && (
                      <Alert variant='danger' className='text-danger'>
                        <FaCircleXmark className='me-2' />
                        <small>
                          Le mot de passe doit être composé de minimum: 12 caractères , 1
                          majuscule, 1 minuscule, et un caratère spécial (#, ~, $, %, *, !, @...).
                        </small>
                      </Alert>
                    )}
                  </Form.Group>
                  <div className='d-grid'>
                    <Button
                      type='submit'
                      size='lg'
                      className='shadow-sm rounded-3 p-3 border-0'
                    >
                      {feedBackState.isLoading ? (
                        <>
                          <Spinner variant='light' size='sm' className='me-2' />
                          <small>{feedBackState.loadingMessage}</small>
                        </>
                      ) : (
                        <small>Mettre à jour le mot de passe</small>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile
