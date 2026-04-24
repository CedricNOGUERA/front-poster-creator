import React from 'react'
import { Col, Container } from 'react-bootstrap'
import sideBarMenuAdmin from '@/data/sideBarMenuAdmin.json'
import userDataStore, { UserDataType } from '@/stores/userDataStore'
import DynamicIcon from '../ui/DynamicIcon'
import { Link } from 'react-router-dom'
import { FaBug } from 'react-icons/fa6'

export const SideBarMenu = ({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<string>>
}) => {

  const userRole = userDataStore((state: UserDataType) => state.role)
  const userName = userDataStore((state: UserDataType) => state.name)


  const menuMap = sideBarMenuAdmin
  .filter((data) => {
    if(userRole === "super_admin"){
      return data.role.some((item) => 
      item === userRole
    )
    }
   
    
    if(userRole === "admin"){
      return data.role.some((item) => 
      item === userRole
      )
    }

  })
  .map((item, indx) =>{ 
    
    return(
      
    <Container
    key={indx}
      className={`dash-menu-link  py-3  rounded-end-3 pointer}`}
    
      onClick={() => setDisplay(item.display)}
    > 
    <Link to={item.href} className='text-decoration-none'>

      <div className='d-flex align-items-center text-decoration-none text-muted ps-2'>
        <DynamicIcon iconKey={item.icon} className='me-2' size={22} />
        {item.title}
      </div>
    </Link>
    </Container>
  )}
)

  return (
    <Col
      sm={2}
      className="border rounded h-100  height-container mt-2 pt-2 pe-2 sticky-top"
    >
      {menuMap}
      {userName === "Cédric" && (
        <Container
          className={`dash-menu-link  py-3 rounded-end pointer}`}
          onClick={() => setDisplay("logs")}
        >
          <Link to="/tableau-de-bord/logs" className="text-decoration-none">
            <div className="d-flex align-items-center text-decoration-none text-muted ps-2">
              <FaBug className="me-2" size={22} />
              Logs
            </div>
          </Link>
        </Container>
      )}
    </Col>
  );
}
