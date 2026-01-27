import { ModalGenericDelete } from '@/components/ui/Modals'
import { ModalAddUser} from '@/components/users/ModalUser'
import UsersServices from '@/services/UsersServices'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import { ToastDataType } from '@/types/DiversType'
import { ShopType } from '@/types/ShopType'
import { UserType } from '@/types/UserType'
import {  _getAllUsers } from '@/utils/apiFunctions'
import React from 'react'
import { Button, Container, Dropdown, Table } from 'react-bootstrap'
import { FaEllipsisVertical, FaPencil, FaTrash } from 'react-icons/fa6'
import { useNavigate, useOutletContext } from 'react-router-dom'

interface ContextShopSelectorType {
  toggleShow: () => void
  setToastData: React.Dispatch<React.SetStateAction<ToastDataType>>
  shops: ShopType[]
  setShops: React.Dispatch<React.SetStateAction<ShopType[]>>
}

export default function UserManager() {
  /* States
   *******************************************************************************************/
  const navigate = useNavigate()
  const { shops} = useOutletContext<ContextShopSelectorType>()

  // const userLogOut = userDataStore((state: UserDataType) => state.authLogout)
  const userRole = userDataStore((state: UserDataType) => state.role)
  const userCompany = userDataStore((state: UserDataType) => state.company )
  const [users, setUsers] = React.useState<UserType[]>([])
  const [showAdd, setShowAdd] = React.useState<boolean>(false)
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showDelete, setShowDelete] = React.useState<boolean>(false)

  /* UseEffect
   *******************************************************************************************/
  React.useEffect(() => {
    // Redirection si l'utilisateur a le rôle "user"
    if (userRole === 'user') {
      navigate('/editeur-de-bon-plan')
      return
    }
    _getAllUsers(setUsers)
    
  }, [userRole, navigate])

  /* Functions
   *******************************************************************************************/
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const handleCloseAdd = () => {
    setShowAdd(false);
    setSelectedUser(null);
  }
  const handleShowAdd = () => {
    setSelectedUser(null); 
    setShowAdd(true);
  }

  const handleShowEdit = (user: UserType) => {
    setSelectedUser(user);
    setShowAdd(true);
  }

  
  const deleteUser = async (id: number) => {
      setIsLoading(true)
    try{
        const response =  await UsersServices.deleteUser(id)
        if(response.ok){
            handleCloseAdd()
            _getAllUsers(setUsers)
        }
    }catch(error){
        console.log(error)
    }finally{
        setIsLoading(false)
    }
  }

  const modalGenericDeleteProps = { show: showDelete, handleClose: handleCloseDelete, selectedId: selectedUserId, handleDelete: deleteUser, title: 'l\'utilisateur', isLoading }
  return (
    <Container fluid className='p-0'>
      <h3 className='py-3'>Gestion des utilisateurs</h3>
      <Container>
        <Table striped hover responsive='sm' className='shadow'>
          <thead className='sticky-sm-top '>
            <tr>
              <th>Enseigne</th>
              <th>Société</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => {
                // Si l'utilisateur connecté est super_admin, il voit tous les utilisateurs
                if (userRole === 'super_admin') {
                  return true;
                }
                // Si l'utilisateur connecté est admin, il ne voit que les utilisateurs de sa/ses compagnie(s)
                // SAUF les super_admin
                if (userRole === 'admin') {
                  // Exclure les super_admin
                  if (user.role === 'super_admin') {
                    return false;
                  }
                  // Vérifier si l'utilisateur appartient à une des compagnies de l'admin connecté
                  return user.company.some((item) =>
                    userCompany.some((uc) => 
                      uc.idCompany === item.idCompany
                    )
                  );
                }
                // Pour les autres rôles (user), logique par défaut
                return user.company.some((item) =>
                  userCompany.some((uc) => 
                    uc.idCompany === item.idCompany
                  )
                );
              })
              .map((user: UserType) => {
                const companyLength = user.company?.length
                const shopLength = shops?.length
                const companylist = (companyLength === shopLength || user.role === 'super_admin') ? "Toutes les enseignes" : user.company.map((item) => item.nameCompany).join(', ')
                const storelist = user.stores && user.stores.map((item) => item.name).join(', ')


                // if(user.role !== 'super_admin'){
                //   return
                // }

                return (
                  <tr key={user.id}>
                    <td>{companylist}</td>
                    <td>{storelist}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant='transparent'
                          id='dropdown-basic'
                          className='border-0 no-chevron'
                        >
                          <b>
                            <FaEllipsisVertical />
                          </b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align='end'>
                          <Dropdown.Item
                            onClick={() => {
                              handleShowEdit(user)
                            }}
                          >
                            <FaPencil /> Modifier
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedUserId(user.id)
                              handleShowDelete()
                            }}
                          >
                            <FaTrash /> Supprimer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </Container>
      <Button variant='primary' className='rounded-pill fab' onClick={handleShowAdd}>
        <strong>+</strong> <span>Ajouter un utilisateur</span>
      </Button>
      <ModalAddUser
        showAdd={showAdd}
        handleCloseAdd={handleCloseAdd}
        userDataToEdit={selectedUser}
        setUsers={setUsers}
      />
      <ModalGenericDelete modalGenericDeleteProps={modalGenericDeleteProps} />
    </Container>
  )
}
