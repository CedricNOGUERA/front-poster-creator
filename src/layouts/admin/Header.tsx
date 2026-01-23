import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import Navbar from "react-bootstrap/Navbar";
import { SideHeaderMenu } from "./SideHeaderMenu";
import userDataStore, {UserDataType} from '@/stores/userDataStore'
import useStoreApp from "@/stores/storeApp";
import { StoreType } from "@/stores/storeApp";
import { Link } from "react-router-dom";
import { FaEllipsisVertical, FaUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

export const AdminHeader = ({titleHeader, setTitleHeader}: {titleHeader: string, setTitleHeader: React.Dispatch<React.SetStateAction<string>>}) => {
  /* States
   *******************************************************************************************/
  const userRole = userDataStore((state: UserDataType) => state.role)
  const userName = userDataStore((state: UserDataType) => state.name)
  const resetStore = useStoreApp((state: StoreType) => state.resetAll)
  const authLogout = userDataStore((state: UserDataType) => state.authLogout)
  const [open, setOpen] = React.useState<boolean>(false);

  /* Functions
   *******************************************************************************************/
  const handleClickLogout = () => {
    resetStore()
    authLogout()
    localStorage.removeItem('token')
  }

  const sideHeaderMenuProps = {
    open,
    setOpen,
    setTitleHeader
  }

  return (
    <header className='bg-danger'>
      <Navbar expand='lg'>
        <Container fluid>
          <Navbar.Brand className='text-white text-uppercase fw-bold mx-auto'>
            {titleHeader}
          </Navbar.Brand>
          <span className='d-flex align-items-center text-white pointer ' title={`Modifier votre mot de passe`} ><Link to="/profile" className="d-flex align-items-center text-decoration-none text-light"><FaUser className='text-light me-2' />{userName}</Link></span>
          {(userRole === "admin" || userRole === "super_admin") ? ( 
            <Button variant='transparent' onClick={() => setOpen(true)} className="d-flex align-items-center ms-3">
            <FaEllipsisVertical className='text-light' />
          </Button>
          ) : (
            <Button variant='transparent'
              href='/login'
              title='Déconnexion'
              onClick={() => handleClickLogout()}
              className='d-flex align-items-center text-decoration-none text-muted ms-3'
            >
              <FaSignOutAlt className='text-light' />
            </Button>
          )}
        </Container>
      </Navbar>
      <SideHeaderMenu sideHeaderMenuProps={sideHeaderMenuProps} />
    </header>
  )
};
