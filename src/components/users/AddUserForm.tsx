import React from 'react'
import { ShopType } from '@/types/ShopType'
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import authServiceInstance from '@/services/AuthService'
import { _getAllShops, _getAllUsers } from '@/utils/apiFunctions'
import { UserType } from '@/types/UserType'
import UsersServices from '@/services/UsersServices'
import userDataStore, { UserDataType } from '@/stores/userDataStore'

export const AddUserForm = ({
  titleButton,
  handleCloseAdd,
  initialData,
  setUsers,
}: {
  titleButton: string
  handleCloseAdd?: () => void
  initialData?: UserType | null
  setUsers?: React.Dispatch<React.SetStateAction<UserType[]>>
}) => {
/* States
 *******************************************************************************************/
  const userStoreData = userDataStore((state: UserDataType) => state)
  const [name, setName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [company, setCompany] = React.useState<{ idCompany: number; nameCompany: string }>({
    idCompany: 0,
    nameCompany: '',
  })
  const [role, setRole] = React.useState<'super_admin' | 'admin' | 'user'>('user')
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [shopData, setshopData] = React.useState<ShopType[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const roles = ['super_admin', 'admin', 'user']

  React.useEffect(() => {
    _getAllShops(setshopData)
  }, [])

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setEmail(initialData.email || '')
      setCompany(initialData.company || { idCompany: 0, nameCompany: '' })
      setRole(initialData.role || 'user')
      setPassword('')
    }
  }, [initialData])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    if (password.length < 12 && titleButton !== 'Modifier') {
      setError('Le mot de passe doit contenir au moins 12 caractères')
      setLoading(false)
      return
    }
    try {
      if (initialData && initialData.id) {
        const updatedData: Partial<UserType> = { name, email, company, role } // Inclure le mot de passe seulement s'il a été modifié
        if (password && password.length > 0) {
          updatedData.password = password
        }

        await UsersServices.updateUser(initialData.id, updatedData)

        setSuccess('Utilisateur modifié avec succès.') // Placeholder
      } else {
        // Logique de création
        const response = await authServiceInstance.register({
          name,
          email,
          password,
          company,
          role,
        })
        const responseData = await response.json()
        setSuccess(
          responseData.message ||
            'Inscription réussie ! Vous pouvez maintenant vous connecter.'
        )
      }
      setTimeout(() => {
        if (titleButton !== 'Ajouter' && titleButton !== 'Modifier') {
          navigate('/login') // Dans le cas d'un ajout depuis la page de register
        } else {
          if(handleCloseAdd){
          handleCloseAdd()
          }
        }
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inattendue est survenue lors de l'inscription.")
      }
    } finally {
      setLoading(false)
      if(setUsers){
        _getAllUsers(setUsers)
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant='danger'>{error}</Alert>}
      {success && <Alert variant='success'>{success}</Alert>}
      <Form.Group className='mb-3' controlId='formBasicName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='text'
          placeholder='Saisissez votre nom'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type='email'
          placeholder='Saisissez votre email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicCompany'>
        <Form.Label>Company</Form.Label>
        <Form.Select
          value={company.idCompany}
          onChange={(e) => {
            const selectedShop = shopData.find((shop) => shop.id === parseInt(e.target.value))
            setCompany({
              idCompany: parseInt(e.target.value),
              nameCompany: (selectedShop && selectedShop.name) || '',
            })
          }}
        >
          <option value=''>Sélectionné une entreprise</option>
          {shopData?.map((shop: ShopType, index: number) => {
            if(userStoreData.company.nameCompany !== shop.name && userStoreData.role !== 'super_admin'){
              return null
            }
            return(
            <option key={index} value={shop.id}>
              {shop.name}
            </option>
          )})}
        </Form.Select>
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicRole'>
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value as 'super_admin' | 'admin' | 'user')}
        >
          <option value=''>Sélectionné un rôle</option>
          {roles?.map((role: string, index: number) => {
            if(userStoreData.role !== 'super_admin' && role === 'super_admin'){
              return null
            }
            return(
            <option key={index} value={role}>
              {role}
            </option>
          )})}
        </Form.Select>
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicPassword'>
        <Form.Label>Mot de passe</Form.Label>
        <InputGroup className='mb-3'>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder='Saisissez votre mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={initialData ? false : true}
          />
          <InputGroup.Text
            id='eyeOrNot'
            className='bg-transparent border border-start-0'
            onClick={() => setShowPassword(!showPassword)}
          >
            {' '}
            <i
              className={`fa-regular fa-${!showPassword ? 'eye-slash' : 'eye'} text-secondary`}
            ></i>
          </InputGroup.Text>
        </InputGroup>
        <Form.Text className='text-muted'>
          Le mot de passe doit contenir au moins 12 caractères.
        </Form.Text>
      </Form.Group>
      <div className={handleCloseAdd ? 'text-end' : 'text-center'}>
        {handleCloseAdd && (
        <Button variant='secondary' onClick={handleCloseAdd} className='me-2'>
          Annuler
        </Button>
        )}
        <Button variant='primary' type='submit' className={handleCloseAdd ? '' : 'w-100'} disabled={loading}>
          {loading ? <Spinner size='sm' animation='border' variant='light' /> : titleButton}
        </Button>
      </div>
    </Form>
  )
}
