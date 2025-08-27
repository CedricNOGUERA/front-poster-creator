import React from 'react'
import { ShopType } from '@/types/ShopType'
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useNavigate, useOutletContext } from 'react-router-dom'
import authServiceInstance from '@/services/AuthService'
import { _getAllUsers } from '@/utils/apiFunctions'
import { UserType } from '@/types/UserType'
import UsersServices from '@/services/UsersServices'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { TagPicker } from 'rsuite'
import { ToastDataType } from '@/types/DiversType'

interface CompanyType { idCompany: number; nameCompany: string }
interface ContextShopSelectorType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  shops: ShopType[]
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>
}

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

const { shops } = useOutletContext<ContextShopSelectorType>()
const userStoreData = userDataStore((state: UserDataType) => state)
  const userRlole = userDataStore((state: UserDataType) => state.role)
  const [name, setName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [company, setCompany] = React.useState<CompanyType[]>([])
  const [role, setRole] = React.useState<'super_admin' | 'admin' | 'user'>('user')
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const roles = ['super_admin', 'admin', 'user']


  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setEmail(initialData.email || '')
      setCompany(initialData.company || [])
      setRole(initialData.role || 'user')
      setPassword('')
    }
  }, [initialData])

  const shopList = shops.map((item: ShopType) => ({ label: item.name, value: item.id }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const regexVerification = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/;
    const passwordValidation = regexVerification.test(password)
    
        if (company.length === 0) {
          setError('Veuillez sélectionner au moins un magasin.')
          setLoading(false)
          return
        }

        if (!passwordValidation && !initialData) {
          setError(
            'Le mot de passe doit être composé de minimum: 12 caractères , 1 majuscule, 1 minuscule, et un caratère spécial (#, ~, $, %, *, !, @...).'
          )
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
      {error && <Alert variant='danger' className='text-danger'><i className='fa fa-circle-xmark me-2'></i>{error}</Alert>}
      {success && <Alert variant='success'><i className='fa fa-circle-check me-2 text-success'></i> {success}</Alert>}
      <Form.Group className='mb-3' controlId='formBasicName'>
        <Form.Label>
          Prénom<span className='text-danger'>*</span>
        </Form.Label>
        <Form.Control
          type='text'
          placeholder='Saisissez votre nom'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>
          Email<span className='text-danger'>*</span>
        </Form.Label>
        <Form.Control
          type='email'
          placeholder='Saisissez votre email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='categoryShops'>
        <Form.Label>
          Magasins<span className='text-danger'>*</span>
        </Form.Label>
        <TagPicker
          data={shopList}
          style={{ width: '100%' }}
          placeholder='Sélectionnez le ou les magasins'
          value={company.map(comp => comp.idCompany)}
          onChange={(values: number[]) => {
            const selectedCompanies = shopList.filter((shop) => values.includes(shop.value))
            const selectedShop = selectedCompanies.map((item) => ({
              nameCompany: item.label,
              idCompany: item.value,
            }))
            setCompany([...selectedShop])
          }}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formBasicRole'>
        <Form.Label>
          Role<span className='text-danger'>*</span>
        </Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value as 'super_admin' | 'admin' | 'user')}
        >
          <option value=''>Sélectionné un rôle</option>
          {roles?.map((role: string, index: number) => {
            if (userStoreData.role !== 'super_admin' && role === 'super_admin') {
              return null
            }
            return (
              <option key={index} value={role}>
                {role}
              </option>
            )
          })}
        </Form.Select>
      </Form.Group>
      {userRlole === "super_admin" && (
      <Form.Group className='mb-3' controlId='formBasicPassword'>
        <Form.Label>
          Mot de passe{!initialData && <span className='text-danger'>*</span>}
        </Form.Label>
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
    
      </Form.Group>
      )}

      <div className={handleCloseAdd ? 'text-end mt-' : 'text-center mt-3'}>
        {handleCloseAdd && (
          <Button variant='secondary' onClick={handleCloseAdd} className='me-2'>
            Annuler
          </Button>
        )}
        <Button
          variant='primary'
          type='submit'
          className={handleCloseAdd ? '' : 'w-100'}
          disabled={loading}
        >
          {loading ? <Spinner size='sm' animation='border' variant='light' /> : titleButton}
        </Button>
      </div>
    </Form>
  )
}
