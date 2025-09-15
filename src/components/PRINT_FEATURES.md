# 🖨️ Fonctionnalités d'impression avancées

## Vue d'ensemble

Le système d'impression avancé permet de générer des PDFs avec plusieurs options d'impression intelligentes, optimisant l'utilisation du papier et réduisant les coûts d'impression.

## 🎯 Fonctionnalités principales

### 1. Impression simple
- Génère un PDF avec une seule copie de l'affiche
- Dimensions exactes de l'affiche
- Idéal pour l'archivage et l'impression directe

### 2. Duplication sur une page
- Place automatiquement plusieurs copies de la même affiche sur une page
- Calcul intelligent du layout optimal
- Support des formats A4, A3, A5, A2, A1, A0 et personnalisés
- Espacement configurable entre les copies

### 3. Combinaison de PDFs
- Combine l'affiche actuelle avec d'autres PDFs
- Conserve les dimensions d'origine de chaque document
- Disposition intelligente sur la page de sortie

## 📏 Formats de page supportés

| Format | Dimensions (mm) | Usage recommandé |
|--------|----------------|------------------|
| A4     | 210 × 297      | Standard, documents |
| A3     | 297 × 420      | Grandes affiches |
| A5     | 148 × 210      | Petites étiquettes |
| A2     | 420 × 594      | Très grandes affiches |
| A1     | 594 × 841      | Bannières |
| A0     | 841 × 1189     | Panneaux |
| Personnalisé | Défini par l'utilisateur | Besoins spécifiques |

## ⚙️ Algorithme de calcul du layout

### Principe
L'algorithme calcule automatiquement la disposition optimale en :
1. Analysant les dimensions de l'affiche
2. Calculant l'espace disponible sur la page
3. Testant différentes configurations (lignes × colonnes)
4. Sélectionnant la configuration qui maximise le nombre de copies

### Exemple de calcul
```
Affiche : 200 × 40 mm
Page A4 : 210 × 297 mm
Espacement : 5 mm

Configuration optimale :
- 2 colonnes × 2 lignes = 4 copies
- Espace requis : (200×2 + 5) × (40×2 + 5) = 405 × 85 mm
- Rentre dans A4 : 210 × 297 mm ✓
```

## 🚀 Utilisation

### Dans les composants d'édition
1. Cliquez sur "Options d'impression" après avoir créé votre affiche
2. Sélectionnez le mode d'impression souhaité
3. Configurez les paramètres (format de page, nombre de copies, espacement)
4. Cliquez sur "Générer PDF"

### Paramètres configurables
- **Mode d'impression** : Simple, Duplication, Combinaison
- **Format de page** : A4, A3, A5, A2, A1, A0, Personnalisé
- **Nombre de copies** : 1-20 (pour le mode duplication)
- **Espacement** : 0-20 mm entre les copies
- **Dimensions personnalisées** : Largeur et hauteur en mm

## 📁 Structure des fichiers

```
front/src/
├── components/
│   ├── PrintOptionsModal.tsx      # Interface principale
│   ├── PrintHelpModal.tsx         # Guide d'utilisation
│   └── PrintDemo.tsx              # Composant de démonstration
└── utils/
    └── printUtils.ts              # Fonctions utilitaires
```

## 🔧 API des fonctions utilitaires

### `generatePDF(canvasElement, templateState, options)`
Fonction principale pour générer un PDF selon les options choisies.

**Paramètres :**
- `canvasElement`: Élément HTML du canvas à capturer
- `templateState`: État du template avec dimensions
- `options`: Options d'impression (mode, format, etc.)

### `calculateOptimalLayout(posterWidth, posterHeight, pageWidth, pageHeight, maxCopies, spacing)`
Calcule la disposition optimale pour placer plusieurs copies.

**Retour :**
- `PrintLayout` avec rows, cols, totalCopies, spacing

### `canFitOnPage(posterWidth, posterHeight, pageWidth, pageHeight, spacing)`
Vérifie si une affiche peut tenir sur une page.

### `calculateScaleFactor(posterWidth, posterHeight, pageWidth, pageHeight, spacing)`
Calcule le facteur de réduction nécessaire.

## 💡 Exemples d'utilisation

### Exemple 1 : Étiquettes de prix
```typescript
const options: PrintOptions = {
  mode: 'multiple',
  pageFormat: 'A4',
  copiesPerPage: 8,
  spacing: 3
}
```

### Exemple 2 : Affiche personnalisée
```typescript
const options: PrintOptions = {
  mode: 'single',
  pageFormat: 'custom',
  customDimensions: { width: 300, height: 200 }
}
```

### Exemple 3 : Combinaison de documents
```typescript
const options: PrintOptions = {
  mode: 'combine',
  pageFormat: 'A3',
  uploadedPDFs: [file1, file2, file3]
}
```

## 🎨 Interface utilisateur

### PrintOptionsModal
- Interface principale pour configurer les options
- Calcul en temps réel du layout optimal
- Aperçu des dimensions et de l'espacement
- Bouton d'aide intégré

### PrintHelpModal
- Guide complet des fonctionnalités
- Exemples d'utilisation
- Conseils d'optimisation
- Cas d'usage pratiques

## 🔍 Dépannage

### Problèmes courants
1. **Affiche trop grande** : Vérifiez les dimensions et l'espacement
2. **Qualité d'image** : Le système utilise une échelle de 4x pour la qualité
3. **Espacement incorrect** : Ajustez la valeur d'espacement dans les options

### Optimisations
- Utilisez le mode duplication pour les petites affiches
- Testez d'abord avec l'impression simple
- Ajustez l'espacement selon vos besoins d'impression

## 📈 Avantages

- **Réduction des coûts** : Optimise l'utilisation du papier
- **Gain de temps** : Calcul automatique du layout
- **Flexibilité** : Support de multiples formats
- **Qualité** : Haute résolution d'impression
- **Facilité d'utilisation** : Interface intuitive

## 🔮 Évolutions futures

- Support de plus de formats de page
- Prévisualisation en temps réel
- Templates de disposition prédéfinis
- Export vers d'autres formats (PNG, JPG)
- Intégration avec des imprimantes spécifiques
