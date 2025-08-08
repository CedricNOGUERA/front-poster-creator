import React from 'react'
import { Col, Container } from 'react-bootstrap'
import sideBarMenuAdmin from '@/data/sideBarMenuAdmin.json'

export const SideBarMenu = ({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<string>>
}) => {
  const menuMap = sideBarMenuAdmin.map((item) => (
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
  ))

  return (
    <Col sm={2} className='border-end h-100  height-container pt-2 pe-2'>
      {menuMap}
    </Col>
  )
}
