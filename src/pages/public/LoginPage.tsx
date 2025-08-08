import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '@/components/loginPage/LoginForm';

const LoginPage: React.FC = () => {


  return (
    <Container className='vh-100 d-flex justify-content-center align-items-center'>
      <Row className='w-100 justify-content-center'>
        <Col xs={11} md={6} lg={5} xl={4}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  )
};

export default LoginPage; 