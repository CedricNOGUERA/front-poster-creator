import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Row, Col, Card } from 'react-bootstrap'
import { AddUserForm } from '@/components/users/AddUserForm'

const RegisterPage: React.FC = () => {

  const navigate = useNavigate()

  return (
    <Container className=''>
      <Row className='d-flex justify-content-center align-items-center vh-100'>
        <Col xs={10} md={6} lg={5}>
          <Card className='p-4 shadow-sm'>
            <h2 className='text-center mb-4'>Créez votre compte</h2>
            <AddUserForm titleButton={'Créer un compte'} />
            <div className='mt-3 text-center'>
              <span>Vous avez déjà un compte ? </span>
              <Button variant='link' onClick={() => navigate('/login')}>
                Connectez-vous ici
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPage
