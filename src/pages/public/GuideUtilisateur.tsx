import userDataStore from '@/stores/userDataStore';
import { RoleType } from '@/types/UserType';
import React from 'react';
import { Container, Row, Col, Card, Nav, Tab, Accordion, Badge, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface RoleDataType {
  id: RoleType
  name: string
  color: string
  icon: string
}

interface ItemWorkflowType {
  step: number
  title: string
  description: string
  details: string
}
interface WorkflowType {
  create_poster: ItemWorkflowType[]
  manage_users: ItemWorkflowType[]
}

const GuideUtilisateur = () => {
  const userRole = userDataStore((state) => state.role)
  const [activeRole, setActiveRole] = React.useState<RoleType>(userRole);

  const roles: RoleDataType[] = [
    { id: 'super_admin', name: 'Super Administrateur', color: 'danger', icon: 'fas fa-crown' },
    { id: 'admin', name: 'Administrateur', color: 'warning', icon: 'fas fa-user-shield' },
    { id: 'user', name: 'Utilisateur', color: 'primary', icon: 'fas fa-user' }
  ];

  const features = {
    super_admin: [
      {
        title: "Gestion des Magasins",
        description: "Créer, modifier et supprimer les magasins disponibles dans l'application",
        icon: "fas fa-store",
        access: "Tableau de bord > Magasins",
        link: "/utilisateurs"
      },
      {
        title: "Gestion des Catégories",
        description: "Définir les types d'affichage disponibles (Bon Plan, Fin de Série, etc.)",
        icon: "fas fa-list",
        link: "/tableau-de-bord/utilisateurs",
        access: "Tableau de bord > Catégories"
      },
      {
        title: "Gestion des Utilisateurs",
        description: "Créer et gérer tous les utilisateurs de l'application",
        icon: "fas fa-users",
        link: "/tableau-de-bord/utilisateurs",
        access: "Tableau de bord > Utilisateurs"
      },
      {
        title: "Photothèque",
        description: "Gérer la bibliothèque d'images et ressources visuelles",
        icon: "fas fa-images",
        link: "/tableau-de-bord/utilisateurs",
        access: "Tableau de bord > Photothèque"
      },
      {
        title: "Créateur d'Affiche",
        description: "Créer de nouveaux modèles d'affiches personnalisés",
        icon: "fas fa-hammer",
        link: "/tableau-de-bord/utilisateurs",
        access: "Créateur d'affiche"
      },
      {
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/tableau-de-bord/utilisateurs",
        access: "Éditeur d'affiche"
      }
    ],
    admin: [
      {
        title: "Gestion des Utilisateurs",
        description: "Créer et gérer les utilisateurs de votre/vos société(s)",
        icon: "fas fa-users",
        link: "/tableau-de-bord/utilisateurs",
        access: "Tableau de bord > Utilisateurs"
      },
      {
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/tableau-de-bord/utilisateurs",
        access: "Éditeur d'affiche"
      }
    ],
    user: [
      {
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/tableau-de-bord/utilisateurs",
        access: "Éditeur d'affiche"
      }
    ]
  };

  const workflows: WorkflowType = {
    create_poster: [
      {
        step: 1,
        title: "Sélection du Magasin",
        description: "Choisissez le magasin pour lequel vous créez l'affiche",
        details: "Cette étape détermine les paramètres spécifiques au magasin (couleurs, logos, etc.)"
      },
      {
        step: 2,
        title: "Sélection du Type d'Affichage",
        description: "Choisissez la catégorie d'affiche (Bon Plan, Fin de Série, etc.)",
        details: "Chaque type a ses propres modèles et paramètres prédéfinis"
      },
      {
        step: 3,
        title: "Sélection du Modèle",
        description: "Choisissez parmi les modèles disponibles pour ce type d'affiche",
        details: "Les modèles sont adaptés au type d'affichage sélectionné"
      },
      {
        step: 4,
        title: "Sélection des Dimensions",
        description: "Définissez la taille finale de votre affiche",
        details: "Les dimensions disponibles dépendent du modèle choisi"
      },
      {
        step: 5,
        title: "Édition et Personnalisation",
        description: "Personnalisez le contenu de votre affiche",
        details: "Modifiez les textes, images, couleurs selon vos besoins"
      }
    ],
    manage_users: [
      {
        step: 1,
        title: "Accès au Tableau de Bord",
        description: "Connectez-vous et accédez à la section Administration",
        details: "Seuls les super_admin et admin peuvent accéder à cette fonctionnalité"
      },
      {
        step: 2,
        title: "Gestion des Utilisateurs",
        description: "Cliquez sur 'Utilisateurs' dans le menu latéral",
        details: "Vous verrez la liste des utilisateurs selon vos permissions"
      },
      {
        step: 3,
        title: "Ajouter un Utilisateur",
        description: "Cliquez sur le bouton '+' pour ajouter un nouvel utilisateur",
        details: "Remplissez le formulaire avec les informations requises"
      },
      {
        step: 4,
        title: "Attribution des Rôles",
        description: "Définissez le rôle et les sociétés de l'utilisateur",
        details: "Les rôles déterminent les permissions d'accès"
      }
    ]
  };

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
                className='p-0 me-3 text-muted'
                // onClick={() => goToStep(storeApp.step - 1)}
                href='/createur-de-bon-plan'
                style={{ textDecoration: 'none' }}
              >
                <i className='fa fa-circle-arrow-left fs-3'></i>
              </Button>
              <i className='fas fa-book me-3'></i>
              Guide Utilisateur{' '}
              <span className='d-none d-md-inline'>- Générateur de Bon Plan</span>
            </h1>
            <p className='lead text-muted'>
              Guide complet pour utiliser l'application selon votre rôle
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className='sticky-top' style={{ top: '20px' }}>
            <Card.Header>
              <h5 className='mb-0'>
                <i className='fas fa-user-tag me-2'></i>
                Rôles Disponibles
              </h5>
            </Card.Header>
            <Card.Body className='p-0'>
              <Nav variant='pills' className='flex-column'>
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
                          className={`d-flex align-items-center text-dark rounded-start-0 ${activeRole === role.id ? "bg-actived-link" : ""}`}
                        >
                          <i className={`${role.icon} me-2 text-muted`}></i>
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
                        <i className={`${role.icon} me-2`}></i>
                        Guide pour {role.name}
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <Alert variant='info' className='mb-4'>
                        <i className='fas fa-info-circle me-2'></i>
                        <strong>Rôle {role.name}:</strong> {getRoleDescription(role.id)}
                      </Alert>

                      <Row>
                        <Col md={6}>
                          <h4 className='text-primary mb-3'>
                            <i className='fas fa-cogs me-2'></i>
                            Fonctionnalités Disponibles
                          </h4>
                          {getRoleFeatures(role.id).map((feature, index) => (
                            <Card
                              key={index}
                              className='mb-3 border-start border-primary border-3'
                            >
                              <Card.Body>
                                <div className='d-flex align-items-start'>
                                  <i className={`${feature.icon} text-primary me-3 mt-1`}></i>
                                  <div className='d-flex-col justify-content-center w-100'>
                                    <h6 className='mb-1'>{feature.title}</h6>
                                    <p className='text-muted small mb-2'>
                                      {feature.description}
                                    </p>
                                    <Link to={feature?.link ? feature?.link : "#"} >
                                    <Badge bg='secondary' className='small'>
                                      <i className='fas fa-route me-1'></i>
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
                            <i className='fas fa-route me-2'></i>
                            Workflows Principaux
                          </h4>

                          <Accordion>
                            <Accordion.Item eventKey='0'>
                              <Accordion.Header>
                                <i className='fas fa-pen-to-square me-2'></i>
                                Créer une Affiche
                              </Accordion.Header>
                              <Accordion.Body>
                                <ol className='mb-0'>
                                  {workflows.create_poster.map((step, index) => (
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

                            {(role.id === 'super_admin' || role.id === 'admin') && (
                              <Accordion.Item eventKey='1'>
                                <Accordion.Header>
                                  <i className='fas fa-users me-2'></i>
                                  Gérer les Utilisateurs
                                </Accordion.Header>
                                <Accordion.Body>
                                  <ol className='mb-0'>
                                    {workflows.manage_users.map((step, index) => (
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
                            )}
                          </Accordion>
                        </Col>
                      </Row>

                      <hr className='my-4' />

                      <Row>
                        <Col>
                          <h4 className='text-warning mb-3'>
                            <i className='fas fa-lightbulb me-2'></i>
                            Conseils et Bonnes Pratiques
                          </h4>
                          <Row>
                            <Col md={6}>
                              <ul className='list-unstyled'>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Sauvegardez régulièrement votre travail
                                </li>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Vérifiez les dimensions avant impression
                                </li>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Utilisez des images haute résolution
                                </li>
                              </ul>
                            </Col>
                            <Col md={6}>
                              <ul className='list-unstyled'>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Respectez les chartes graphiques des magasins
                                </li>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Testez l'affichage sur différents écrans
                                </li>
                                <li className='mb-2'>
                                  <i className='fas fa-check text-success me-2'></i>
                                  Consultez les modèles existants pour l'inspiration
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <div className='text-center mt-4'>
                        <Link to='/login' className='btn btn-primary btn-lg'>
                          <i className='fas fa-sign-in-alt me-2'></i>
                          Accéder à l'Application
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
    user: "Accès uniquement à l'éditeur d'affiches pour créer des affiches personnalisées selon les modèles disponibles."
  };
  return descriptions[role as keyof typeof descriptions] || '';
};

export default GuideUtilisateur;
