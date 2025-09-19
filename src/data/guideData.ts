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
    name: string
      role: RoleType[],
      dataList: ItemWorkflowType[]
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
        title: "Éditeur d'Affiche",
        description: "Utiliser l'éditeur pour créer des affiches personnalisées",
        icon: "fas fa-pen-to-square",
        link: "/editeur-de-bon-plan",
        access: "Éditeur d'affiche"
      },
      {
        title: "Gestion des Utilisateurs",
        description: "Créer et gérer les utilisateurs de votre/vos société(s)",
        icon: "fas fa-users",
        link: "/tableau-de-bord/utilisateurs",
        access: "Tableau de bord > Utilisateurs"
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

  export const Workflows: WorkflowType[] = [

    {
      name: "Créer un affiche",
      role: ["super_admin"],
      dataList: [
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
          details: "Les dimensions disponibles sont prédéfinies"
        },
        {
          step: 5,
          title: "Création et Personnalisation",
          description: "Personnalisez le contenu de votre affiche",
          details: "Créer les textes et placer des images selon vos besoins"
        }
      ]
    },
    {
      name: "Editer une affiche",
      role: ["super_admin", "admin", "user"],
      dataList: [
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
          details: "Modifiez et déplacer  les textes, les images selon vos besoins"
        }
      ]
    },
    {
      name: "Gérer les magasins",
      role: ["super_admin"],
      dataList: [
        {
          step: 1,
          title: "Accès au Tableau de Bord",
          description: "Connectez-vous et accédez à la section Administration",
          details: "Seuls les super_admin peuvent accéder à cette fonctionnalité"
        },
        {
          step: 2,
          title: "Gestion des Magasins",
          description: "Cliquez sur 'Magasins' dans le menu latéral",
          details: "Vous verrez la liste des magasins"
        },
        {
          step: 3,
          title: "Ajouter un Magasin",
          description: "Cliquez sur le bouton '+' pour ajouter un nouveau Magasin",
          details: "Remplissez le formulaire avec les informations requises"
        },
        {
          step: 4,
          title: "Modifier ou supprimer un Magasin",
          description: "Sur la ligne d'un magasin, cliquez sur les 3 points dans la colonnes 'Action' pour le modifier ou le supprimer",
          details: "Modifier les champs du formulaire avec les informations requises"
        }
      ]
    },
    {
      name: "Gérer les catégories",
      role: ["super_admin"],
      dataList: [
        {
          step: 1,
          title: "Accès au Tableau de Bord",
          description: "Connectez-vous et accédez à la section Administration",
          details: "Seuls les super_admin peuvent accéder à cette fonctionnalité"
        },
        {
          step: 2,
          title: "Gestion des Catégories",
          description: "Cliquez sur 'Catégories' dans le menu latéral",
          details: "Vous verrez la liste des catégories"
        },
        {
          step: 3,
          title: "Ajouter une Catégories",
          description: "Cliquez sur le bouton '+' pour ajouter une nouvelle catégorie",
          details: "Remplissez le formulaire avec les informations requises"
        },
        {
          step: 4,
          title: "Modifier ou supprimer une Catégorie",
          description: "Sur la ligne d'une catégorie, cliquez sur les 3 points dans la colonnes 'Action' pour la modifier ou la supprimer",
          details: "Modifier les champs du formulaire avec les informations requises"
        }
      ]
    },
    {
      name: "Gérer les utilisateurs",
      role: ["super_admin", "admin"],
      dataList: [
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
        },
        {
          step: 5,
          title: "Modifier ou supprimer un Utilisateur",
          description: "Sur la ligne d'un utilisateur, cliquez sur les 3 points dans la colonnes 'Action' pour le modifier ou le supprimer",
          details: "Modifier les champs du formulaire avec les informations requises"
        }
      ]
    },
    {
      name: "Gérer les images",
      role: ["super_admin"],
      dataList: [
        {
          step: 1,
          title: "Accès au Tableau de Bord",
          description: "Connectez-vous et accédez à la section Administration",
          details: "Seuls les super_admin peuvent accéder à cette fonctionnalité"
        },
        {
          step: 2,
          title: "Gestion de la bibliothèque d'images",
          description: "Cliquez sur 'Photothèque' dans le menu latéral",
          details: "Vous verrez la liste des images"
        },
        {
          step: 3,
          title: "Ajouter une Image",
          description: "Cliquez sur le bouton '+' pour ajouter une nouvelle image",
          details: "Remplissez le formulaire avec les informations requises"
        },
        {
          step: 4,
          title: "Supprimer une Image",
          description: "Survoler une image pour afficher le bouton de suppression 'X'",
          details: "Clique le bouton pour supprimer l'image"
        }
      ]
    }
  ]
