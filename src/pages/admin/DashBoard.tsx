import React from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import ShopPage from './ShopPage'
import CategoriesPage from './CategoriesPage'
import UserManager from './UserManager'
import { SideBarMenu } from '@/components/dashBoardComponents/SideBarMenu'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import PicturesLibraryPage from './PicturesLibraryPage'

const DashBoard = () => {
  const [display, setDisplay] = React.useState('shops')
  const userRole = userDataStore((state: UserDataType) => state.role)

  React.useEffect(() => {
    if (userRole !== 'super_admin') {
      setDisplay('utilisateurs')
      return
    }
  }, [userRole])

  const handleDisplay = (display: string) => {
    if (display === 'shops') {
      return <ShopPage />
    } else if (display === 'categories') {
      return <CategoriesPage />
    } else if (display === 'utilisateurs') {
      return <UserManager />
    } else if (display === 'phototheque') {
      return <PicturesLibraryPage />
    }
  }

  return (
    <Container fluid className='px-0'>
      <Row className='w-100 gx-0' >
        <SideBarMenu setDisplay={setDisplay} />
        <Col className='h-100'>
          {handleDisplay(display)}
        </Col>
      </Row>
    </Container>
  )
}

export default DashBoard
