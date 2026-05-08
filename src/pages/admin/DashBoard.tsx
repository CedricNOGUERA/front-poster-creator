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
import TemplatePage from './TemplatePage'
import MonitoringPage from './MonitoringPage'
import ConnexionCount from './ConnexionCount'
import StorePage from './StorePage'

interface ContextType {
  setTitleHeader: React.Dispatch<React.SetStateAction<string>>
}

const ADMIN_PAGES: Record<string, { path: string; component: React.ReactNode }> = {
  utilisateurs: { path: '/utilisateurs', component: <UserManager /> },
  categories: { path: '/categories', component: <CategoriesPage /> },
  templates: { path: '/templates', component: <TemplatePage /> },
  phototheque: { path: '/phototheque', component: <PicturesLibraryPage /> },
  shops: { path: '/enseignes', component: <ShopPage /> },
  stores: { path: '/magasins', component: <StorePage /> },
  logs: { path: '/logs', component: <MonitoringPage /> },
  modeles: { path: '/modeles', component: <ModelsPage /> },
  connexions: { path: '/connexions', component: <ConnexionCount /> },
};

const DashBoard = () => {
  const { setTitleHeader} = useOutletContext<ContextType>()
  const location = useLocation()
  const userRole = userDataStore((state: UserDataType) => state.role)


  const getDisplayFromUrl = React.useCallback(() => {
  // On cherche la clé dont le path est inclus dans l'URL
  const found = Object.keys(ADMIN_PAGES).find(key => 
    location.pathname.includes(ADMIN_PAGES[key].path)
  );

  if (found) return found;

  // Par défaut selon le rôle
  return userRole === 'super_admin' ? 'shops' : 'utilisateurs';
}, [location.pathname, userRole]);

    const [display, setDisplay] = React.useState(getDisplayFromUrl)

    React.useEffect(() => {
    setDisplay(getDisplayFromUrl())
    setTitleHeader('Administration')
  }, [getDisplayFromUrl, setTitleHeader])

const handleDisplay = (displayKey: string) => {
  // On récupère directement le composant via la clé
  return ADMIN_PAGES[displayKey]?.component || null;
};

  return (
    <Container fluid className='px-0'>
      <Row className='w-100 gx-0 relative' >
        <SideBarMenu setDisplay={setDisplay} />
        <Col className='h-100'>
          {handleDisplay(display)}
        </Col>
      </Row>
    </Container>
  )
}

export default DashBoard
