/* eslint-disable react-hooks/exhaustive-deps */
import DynamicIcon from '@/components/ui/DynamicIcon';
import { features, roles, Workflows } from '@/data/guideData';
import userDataStore from '@/stores/userDataStore';
import { RoleType } from '@/types/UserType';
import React from 'react';
import { Container, Row, Col, Card, Nav, Tab, Accordion, Badge, Alert, Button } from 'react-bootstrap';
import { FaCogs, FaInfoCircle } from 'react-icons/fa';
import { FaBook, FaCircleArrowLeft, FaRoute, FaUserTag } from 'react-icons/fa6';
import { Link, useOutletContext } from 'react-router-dom';


interface ContextType {
  setTitleHeader: React.Dispatch<React.SetStateAction<string>>
}

const GuideUtilisateur = () => {
  const {setTitleHeader} = useOutletContext<ContextType>()
  const userRole = userDataStore((state) => state.role)
  const [activeRole, setActiveRole] = React.useState<RoleType>(userRole);

  React.useEffect(() => {
    setTitleHeader("Guide de l'utilisateur")
  }, [])


  const getRoleFeatures = (role: string) => {
    return features[role as keyof typeof features] || [];
  };

  return (
    <Container fluid className='py-4'>
      <Row>
        <Col>
          <div className='text-center mb-4'>
            <h1 className='display-4 text-primary'>
              <Button
                variant='link'
                className='p-0 me-3 text-'
                href='/editeur-de-bon-plan'
                style={{ textDecoration: 'none' }}
              >
                <FaCircleArrowLeft className='fs-3' />
              </Button>
              <FaBook className='me-3' />
              Guide Utilisateur{' '}
              <span className='d-none d-md-inline'>- Générateur de Bon Plan</span>
            </h1>
            <p className='lead text-muted'>
              {/* Guide complet pour utiliser l'application selon votre rôle */}
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className='sticky-top' style={{ top: '20px' }}>
            <Card.Header>
              <h5 className='mb-0'>
                <FaUserTag className='me-2' />
                Rôles Disponibles
              </h5>
            </Card.Header>
            <Card.Body className='p-0'>
              <Nav variant='pills' className='flex-column py-1'>
                {roles
                  .filter((data) => {
                    //super_admin voit tous les rôles
                    if (userRole === 'super_admin') {
                      return true
                    }
                    //admin voit tous les rôles, suaf le rôle super_admin
                    if (userRole === 'admin') {
                      if (data.id === 'super_admin') {
                        return false
                      }
                      if (data.id === 'user' || data.id === userRole) {
                        return true
                      }
                    }
                    // logique par défaut, le rôle user ne voit que le sien
                    return data.id === userRole
                  })
                  .map((role) => {
                    return (
                      <Nav.Item key={role.id} className='pe-1'>
                        <Nav.Link
                          onClick={() => setActiveRole(role.id)}
                          className={`d-flex align-items-center text-dark rounded-start-0 ${
                            activeRole === role.id ? 'bg-actived-link' : ''
                          }`}
                        >
                          <DynamicIcon iconKey={role.icon} className='text-muted me-2' size={22} />
                          {role.name}
                        </Nav.Link>
                      </Nav.Item>
                    )
                  })}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Tab.Container activeKey={activeRole}>
            <Tab.Content>
              {roles.map((role) => (
                <Tab.Pane key={role.id} eventKey={role.id}>
                  <Card>
                    <Card.Header className={`bg-${role.color} text-white`}>
                      <h3 className='mb-0'>
                      <DynamicIcon iconKey={role.icon} className='me-2' size={22} />
                        {role.name}
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <Alert variant='info' className='mb-4'>
                        <FaInfoCircle className='me-2' />
                        <strong>Rôle {role.name}:</strong> {getRoleDescription(role.id)}
                      </Alert>
                      <Row>
                        <Col md={6}>
                          <h4 className='text-primary mb-3'>
                            <FaCogs className='me-2' />
                            Fonctionnalités Disponibles
                          </h4>
                          {getRoleFeatures(role.id).map((feature, index) => (
                            <Card
                              key={index}
                              className='mb-3 border-start border-primary border-3'
                            >
                              <Card.Body>
                                <div className='d-flex align-items-start'>
                                  <DynamicIcon iconKey={feature.icon} className='text-primary me-3 mt-1' size={22} />
                                  <div className='d-flex-col justify-content-center w-100'>
                                    <h6 className='mb-1'>{feature.title}</h6>
                                    <p className='text-muted small mb-2'>
                                      {feature.description}
                                    </p>
                                    <Link to={feature?.link ? feature?.link : '#'}>
                                      <Badge bg='secondary' className='small'>
                                        <FaRoute className='me-2' />
                                        {feature.access}
                                      </Badge>
                                    </Link>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </Col>
                        <Col md={6}>
                          <h4 className='text-success mb-3'>
                            <FaRoute className='me-2' />
                            Workflows Principaux
                          </h4>
                          <Accordion>
                            {Workflows.filter((data) =>
                              data.role.some((item) => item === activeRole)
                            ).map((item, indx) => (
                              <Accordion.Item key={indx} eventKey={item.name}>
                                <Accordion.Header>
                                <DynamicIcon iconKey={item.icon} className='me-2' size={22} />
                                  {item.name}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <ol className='mb-0'>
                                    {item.dataList.map((step, index) => (
                                      <li key={index} className='mb-2'>
                                        <strong>{step.title}</strong>
                                        <p className='text-muted small mb-1'>
                                          {step.description}
                                        </p>
                                        <small className='text-info'>{step.details}</small>
                                      </li>
                                    ))}
                                  </ol>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                          </Accordion>
                        </Col>
                      </Row>
                      <div className='text-center mt-4'>
                        <Link to='/editeur-de-bon-plan' className='btn btn-primary btn-lg'>
                          <FaCircleArrowLeft className='me-2' />
                          Retour
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  )
};

const getRoleDescription = (role: string): string => {
  const descriptions = {
    super_admin: "Accès complet à toutes les fonctionnalités de l'application. Peut gérer les magasins, catégories, utilisateurs et créer des modèles d'affiches.",
    admin: "Peut gérer les utilisateurs de sa/ses société(s) et utiliser l'éditeur d'affiches. Accès limité aux fonctionnalités administratives.",
    user: "Accès uniquement à l'éditeur d'affiches pour les personnalisées selon les modèles disponibles."
  };
  return descriptions[role as keyof typeof descriptions] || '';
};

export default GuideUtilisateur;
