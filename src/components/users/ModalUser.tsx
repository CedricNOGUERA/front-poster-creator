import { Button, Modal, Spinner } from "react-bootstrap"
import { AddUserForm } from "./AddUserForm"
import { UserType } from "@/types/UserType"
import { ModalDeleteUserType } from "@/types/ModalType"
import { FaCircleXmark } from "react-icons/fa6"


export const ModalAddUser = ({showAdd, handleCloseAdd, userDataToEdit, setUsers}: {showAdd: boolean, handleCloseAdd: () => void, userDataToEdit?: UserType | null, setUsers: React.Dispatch<React.SetStateAction<UserType[]>>}) => {
    const titleButton = userDataToEdit ? "Modifier" : "Ajouter"
    const modalTitle = userDataToEdit ? "Modifier l'utilisateur" : "Ajouter l'utilisateur"
    const modalIcon = userDataToEdit ? "ri-user-settings-line" : "ri-user-add-line"

  return (
    <Modal show={showAdd} onHide={handleCloseAdd}>
      <Modal.Header>
        <Modal.Title>
          <h2>
            <i className={`${modalIcon} me-3`}></i>
            {modalTitle}
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddUserForm titleButton={titleButton} handleCloseAdd={handleCloseAdd} initialData={userDataToEdit} setUsers={setUsers} />
      </Modal.Body>
    </Modal>
  )
}

export function ModalDelete({modalDeleteProps}: {modalDeleteProps: ModalDeleteUserType}) {
    const { showDelete, handleCloseDelete, selectedUser, deleteUser, isLoading } = modalDeleteProps
  return (
    <Modal show={showDelete} onHide={handleCloseDelete}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCircleXmark className='me-2 text-danger' />
          
          Suppression d'utilisateur
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Etes sûr de vouloir supprimer cet utilisateur ?
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseDelete}>
          Annuler
        </Button>
        <Button
          variant='danger'
          onClick={() => {
            if(selectedUser) {
              deleteUser(selectedUser.id)
              handleCloseDelete()
            }
          }}
          disabled={isLoading}
        >
            {isLoading ? <Spinner size="sm" animation="border" variant="light" /> : "Valider"}
          

        </Button>
      </Modal.Footer>
    </Modal>
  )
}

