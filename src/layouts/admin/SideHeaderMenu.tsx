import { UserDataType } from '@/stores/userDataStore'
import useStoreApp from '@/stores/storeApp'
import userDataStore from '@/stores/userDataStore'
import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Drawer from 'rsuite/esm/Drawer'
import headerMenuItems from '@/data/headerMenuItems.json'
import { FaSignOutAlt } from 'react-icons/fa'

export const SideHeaderMenu = ({
  sideHeaderMenuProps,
}: {
  sideHeaderMenuProps: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setTitleHeader: React.Dispatch<React.SetStateAction<string>>
  }
}) => {
  /* States
   *******************************************************************************************/

  const { open, setOpen, setTitleHeader } = sideHeaderMenuProps
  const resetStore = useStoreApp((state) => state.resetAll)
  const authLogout = userDataStore((state: UserDataType) => state.authLogout)
  const userRole = userDataStore((state: UserDataType) => state.role)
  /* Functions
   *******************************************************************************************/
  const handleClick = (title: string) => {
    resetStore()
    setOpen(false)
    setTitleHeader(title)
  }

  const handleClickLogout = () => {
    resetStore()
    setOpen(false)
    authLogout()
    localStorage.removeItem('token')
  }

  return (
    <Drawer size='xs' open={open} onClose={() => setOpen(false)} className='drawer-menu'>
      <Drawer.Header className=''>
        <Drawer.Title>Menu</Drawer.Title>
        <Drawer.Actions></Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body className='bg-light ps-2 pe-0'>
        {headerMenuItems
          .filter((item) => !item.roles || item.roles.includes(userRole))
          .map((item) => (
              <Link
              key={item.id} 
                to={item.href}
                onClick={() => handleClick(item.title)}
                className='d-flex align-items-center text-decoration-none text-muted'
              >
            <Container className='menu-link py-3 rounded-start'>
                <i className={`${item.icon} me-2 fs-5`}></i>
                {item.title}
            </Container>
              </Link>
          ))}
        <Container className=' log-out  py-3 px-0 border-top'>
          <Container className=' menu-link py-3 rounded-start'>
            <Link
              to='/login'
              onClick={() => handleClickLogout()}
              className='d-flex align-items-center text-decoration-none text-muted'
            >
              <FaSignOutAlt className='me-2 fs_3' />
              Déconnexion
            </Link>
          </Container>
        </Container>
      </Drawer.Body>
    </Drawer>
  )
}
