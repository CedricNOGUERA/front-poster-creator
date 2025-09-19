// import userDataStore, { UserDataType } from '@/stores/userDataStore'
// import React from 'react'
// import { Button, Form, InputGroup } from 'react-bootstrap'

// export default function Account() {

//     const userStoreData = userDataStore((state: UserDataType) => state)

//   const [name, setName] = React.useState<string>('')
//   const [email, setEmail] = React.useState<string>('')
//   const [shop, setShop] = React.useState<string>('')
//   const [role, setRole] = React.useState<string>('')
//   const [password, setPassword] = React.useState('')
//   const [showPassword, setShowPassword] = React.useState<boolean>(false)

//   return (
//     <div className='pt-4'>
//       <Form>
//         {/* {error && <Alert variant='danger'>{error}</Alert>} */}
//         {/* {success && <Alert variant='success'>{success}</Alert>} */}
//         <Form.Group className='mb-3 text-start' controlId='formBasicName'>
//           <Form.Label>Prénom</Form.Label>
//           <Form.Control
//             type='text'
//             value={userStoreData.name}
//             onChange={(e) => setName(e.target.value)}
//             readOnly
//           />
//         </Form.Group>
//         <Form.Group className='mb-3 text-start' controlId='formBasicEmail'>
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type='email'
//             value={userStoreData.email}
//             onChange={(e) => setEmail(e.target.value)}
//             readOnly
//           />
//         </Form.Group>
//         <Form.Group className='mb-3 text-start' controlId='categoryShops'>
//           <Form.Label>Magasins</Form.Label>
//           {/* <TagPicker
//           data={shopList}
//           style={{ width: '100%' }}
//           placeholder='Sélectionnez le ou les magasins'
//           onChange={(values: number[]) => {
//             const selectedCompanies = shopList.filter((shop) => values.includes(shop.value))
//             const selectedShop = selectedCompanies.map((item) => ({
//               nameCompany: item.label,
//               idCompany: item.value,
//             }))
//             setCompany([...selectedShop])
//           }}
//         /> */}
//           <Form.Control
//             type='text'
//             value={userStoreData.company[0].nameCompany + ", " + userStoreData.company[1].nameCompany}
//             onChange={(e) => setShop(e.target.value)}
//             readOnly
//           />
//         </Form.Group>
//         <Form.Group className='mb-3 text-start' controlId='formBasicRole'>
//           <Form.Label>Rôle</Form.Label>
//           <Form.Control
//             type='text'
//             value={userStoreData.role}
//             onChange={(e) => setShop(e.target.value)}
//             readOnly
//           />
//         </Form.Group>
//         <Form.Group className='mb-3 text-start' controlId='formBasicPassword'>
//           <Form.Label>
//             Mot de passe<span className='text-danger'>*</span>
//           </Form.Label>
//           <InputGroup className='mb-3'>
//             <Form.Control
//               type={showPassword ? 'text' : 'password'}
//               placeholder='Saisissez votre mot de passe'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <InputGroup.Text
//               id='eyeOrNot'
//               className='bg-transparent border border-start-0'
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {' '}
//               <i
//                 className={`fa-regular fa-${
//                   !showPassword ? 'eye-slash' : 'eye'
//                 } text-secondary`}
//               ></i>
//             </InputGroup.Text>
//           </InputGroup>
//           <Form.Text className='text-muted'>
//             Le mot de passe doit contenir au moins 12 caractères.
//           </Form.Text>
//         </Form.Group>
//         <div className=''>
//           <Button variant='secondary' className='me-2'>
//             Annuler
//           </Button>

//           <Button
//             variant='primary'
//             type='submit'
//             className=''
//             //   disabled={loading}
//           >
//             Valider
//             {/* {loading ? <Spinner size='sm' animation='border' variant='light' /> : titleButton} */}
//           </Button>
//         </div>
//       </Form>
//     </div>
//   )
// }

import UsersServices from '@/services/UsersServices'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { ToastDataType } from '@/types/DiversType'
import { UserType } from '@/types/UserType'
import { _expiredSession, _showToast } from '@/utils/notifications'
import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap'
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
                <i className='fa fa-circle-arrow-left fs-3'></i>
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
                        {' '}
                        <i
                          className={`fa-regular fa-${
                            !showPassword ? 'eye-slash' : 'eye'
                          } text-secondary`}
                        ></i>
                      </InputGroup.Text>
                    </InputGroup>
                    {errorPass && (
                      <Alert variant='danger' className='text-danger'>
                        <i className='fa fa-circle-xmark me-2 text-'></i>
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
                      style={
                        {
                          // background:
                          //   'linear-gradient(135deg, #667eea 0%,rgb(134, 75, 162) 100%)',
                        }
                      }
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
