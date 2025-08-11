import React from 'react'
import { Col, Container } from 'react-bootstrap'
import sideBarMenuAdmin from '@/data/sideBarMenuAdmin.json'
import userDataStore, { UserDataType } from '@/stores/userDataStore'

export const SideBarMenu = ({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<string>>
}) => {

  const userRole = userDataStore((state: UserDataType) => state.role)


  const menuMap = sideBarMenuAdmin
  .filter((data) => {
    if(userRole === "super_admin"){
      return true
    }
    
    if(userRole === "admin"){
      return data.role.some((item) => 
      item === userRole
      )
    }

  })
  .map((item) =>{ 

    return(
    <Container
    key={item.id}
      className='dash-menu-link  py-3 rounded-end pointer'
      onClick={() => setDisplay(item.display)}
    >
      <div className='d-flex align-items-center text-decoration-none text-muted ps-2'>
        <i className={`${item.icon} me-2`}></i>
        {item.title}
      </div>
    </Container>
  )}
)

  return (
    <Col sm={2} className='border-end h-100  height-container pt-2 pe-2'>
      {menuMap}
    </Col>
  )
}
