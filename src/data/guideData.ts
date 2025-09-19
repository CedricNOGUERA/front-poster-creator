import { RoleType } from "@/types/UserType"

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


export const roles: RoleDataType[] = [
    { id: 'super_admin', name: 'Super Administrateur', color: 'danger', icon: 'fas fa-crown' },
    { id: 'admin', name: 'Administrateur', color: 'warning', icon: 'fas fa-user-shield' },
    { id: 'user', name: 'Utilisateur', color: 'primary', icon: 'fas fa-user' }
  ];

  export const features = {
    super_admin: [
      {
        title: "Gestion des Magasins",
        description: "Créer, modifier et supprimer les magasins disponibles dans l'application",
        icon: "fas fa-store",
        access: "Tableau de bord > Magasins",
        link: "/tableau-de-bord/magasins"
      },
      {
        title: "Gestion des Catégories",
        description: "Définir les types d'affichage disponibles (Bon Plan, Fin de Série, etc.)",
        icon: "fas fa-list",
        link: "/tableau-de-bord/categories",
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
        link: "/tableau-de-bord/phototheque",
        access: "Tableau de bord > Photothèque"
      },
      {
        title: "Créateur d'Affiche",
        description: "Créer de nouveaux modèles d'affiches personnalisés",
        icon: "fas fa-hammer",
        link: "/createur-de-bon-plan",
        access: "Créateur d'affiche"
      },
      {
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/editeur-de-bon-plan",
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
        link: "/editeur-de-bon-plan",
        access: "Éditeur d'affiche"
      }
    ],
    user: [
      {
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/editeur-de-bon-plan",
        access: "Éditeur d'affiche"
      }
    ]
  };

  export const workflows: WorkflowType = {
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