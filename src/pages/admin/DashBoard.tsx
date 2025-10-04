import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ShopPage from './ShopPage'
import CategoriesPage from './CategoriesPage'
import UserManager from './UserManager'
import { SideBarMenu } from '@/components/dashBoardComponents/SideBarMenu'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import PicturesLibraryPage from './PicturesLibraryPage'
import { useLocation, useOutletContext } from 'react-router-dom'
import ModelsPage from './ModelPage'

interface ContextType {
  setTitleHeader: React.Dispatch<React.SetStateAction<string>>
}

const DashBoard = () => {
  const { setTitleHeader} = useOutletContext<ContextType>()
  const location = useLocation()
  const userRole = userDataStore((state: UserDataType) => state.role)
  
  // Déterminer la section à afficher basée sur l'URL
  const getDisplayFromUrl = React.useCallback(() => {
    if (location.pathname.includes('/utilisateurs')) {
      return 'utilisateurs'
    }
    if (location.pathname.includes('/categories')) {
      return 'categories'
    }
    if (location.pathname.includes('/phototheque')) {
      return 'phototheque'
    }
    if (location.pathname.includes('/shops')) {
      return 'shops'
    }
    // Par défaut selon le rôle
    return userRole === 'super_admin' ? 'shops' : 'utilisateurs'
  }, [location.pathname, userRole])

  const [display, setDisplay] = React.useState(getDisplayFromUrl)

  React.useEffect(() => {
    setDisplay(getDisplayFromUrl())
    setTitleHeader('Administration')
  }, [getDisplayFromUrl, setTitleHeader])

  const handleDisplay = (display: string) => {
    if (display === 'shops') {
      return <ShopPage />
    } else if (display === 'categories') {
      return <CategoriesPage />
    } else if (display === 'utilisateurs') {
      return <UserManager />
    } else if (display === 'phototheque') {
      return <PicturesLibraryPage />
    }else if (display === 'models') {
      return <ModelsPage />
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
