import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import notFound from '@/assets/images/404.svg'

export default function NotFound() {
    return (
      <div className='d-flex flex-column w-100 vh-100 align-items-center justify-content-center'>
        <div className='text-center'>
          <img src={notFound} alt='404' width='100%' />
        </div>
        <div className='d-flex justify-content-center align-items-center text-muted p-1 p-lg-3'>
          <Row>
            <Col xs={12} md={12} className='text-center py-3'>
              404 Error - Not Found
              <br />
              Oups… Vous venez de trouver une page d'erreur !!! <br />
              Nous sommes désolés mais la page que vous recherchez n'a pas été trouvé
            </Col>
            <Col xs={12} md={12} className='text-center'>
              <ButtonGroup aria-label='Basic example'>
                <Button variant='secondary' href='/editeur-de-bon-plan' className='text-light m-auto'>
                  {' '}
                  <svg
                    width='1em'
                    height='1.5em'
                    viewBox='0 0 16 16'
                    fill='currentColor'
                    aria-hidden='true'
                    focusable='false'
                    className='rs-icon'
                    aria-label='arrow left line'
                    data-category='direction'
                  >
                    <path d='M9.707 5.707L7.415 8l2.292 2.293a.999.999 0 11-1.414 1.414l-3-3a.99.99 0 01-.277-.531l-.014-.117v-.118a.997.997 0 01.291-.648l3-3a.999.999 0 111.414 1.414z'></path>
                  </svg>
                </Button>
                <Button variant='secondary' href='/editeur-de-bon-plan' className='text-light'>
                  Revenir la maison
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </div>
      </div>
    )
}
