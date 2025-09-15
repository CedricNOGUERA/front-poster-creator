# 📊 Diagramme du système d'impression

## Flux de données

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Canvas HTML   │───▶│  PrintOptionsModal │───▶│   printUtils    │
│   (Affiche)     │    │   (Interface)     │    │  (Génération)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  PrintHelpModal  │    │      PDF        │
                       │   (Aide)         │    │   (Résultat)    │
                       └──────────────────┘    └─────────────────┘
```

## Algorithme de calcul du layout

```
1. Dimensions de l'affiche (W × H)
2. Dimensions de la page (PW × PH)
3. Espacement souhaité (S)
4. Nombre max de copies (N)

Pour chaque configuration (cols, rows):
  - Calculer espace requis = (W × cols + S × (cols-1)) × (H × rows + S × (rows-1))
  - Vérifier si rentre dans (PW × PH)
  - Si oui et totalCopies ≤ N, garder cette configuration
  - Sélectionner la configuration avec le plus de copies

Résultat: Layout optimal (rows, cols, totalCopies, spacing)
```

## Modes d'impression

```
Mode Simple:
┌─────────────┐
│   Canvas    │ ──▶ PDF (1 copie, dimensions exactes)
└─────────────┘

Mode Duplication:
┌─────────────┐
│   Canvas    │ ──▶ PDF (N copies, layout optimisé)
└─────────────┘

Mode Combinaison:
┌─────────────┐    ┌─────────────┐
│   Canvas    │    │  PDFs       │ ──▶ PDF combiné
└─────────────┘    │  uploadés   │
                   └─────────────┘
```

## Exemple concret : Affiche 200×40 sur A4

```
Dimensions:
- Affiche: 200 × 40 mm
- Page A4: 210 × 297 mm
- Espacement: 5 mm

Calcul:
- Configuration 2×2: (200×2 + 5) × (40×2 + 5) = 405 × 85 mm
- 405 > 210 ❌ (ne rentre pas)

- Configuration 1×4: (200×1 + 0) × (40×4 + 15) = 200 × 175 mm
- 200 ≤ 210 et 175 ≤ 297 ✅ (rentre)

Résultat: 1 colonne × 4 lignes = 4 copies
```

## Architecture des composants

```
PrintOptionsModal
├── Mode sélection (Simple/Duplication/Combinaison)
├── Format de page (A4/A3/A5/A2/A1/A0/Personnalisé)
├── Paramètres (copies, espacement, dimensions)
├── Calcul en temps réel du layout
└── Génération du PDF

PrintHelpModal
├── Guide des fonctionnalités
├── Exemples d'utilisation
├── Conseils d'optimisation
└── Cas d'usage pratiques

printUtils
├── generatePDF() - Fonction principale
├── calculateOptimalLayout() - Calcul du layout
├── canFitOnPage() - Vérification de compatibilité
└── calculateScaleFactor() - Calcul de réduction
```

## Intégration dans les éditeurs

```
DragDropEditor
├── Bouton "Options d'impression"
├── PrintOptionsModal
└── Génération PDF

InlineDragDropEditor
├── Bouton "Options d'impression"
├── PrintOptionsModal
└── Génération PDF

UpdateModel
├── Bouton "Options d'impression"
├── PrintOptionsModal
└── Génération PDF

EditorTemplate
├── Bouton "Options d'impression"
├── PrintOptionsModal
└── Génération PDF
```

## Flux de génération PDF

```
1. Utilisateur clique "Options d'impression"
2. PrintOptionsModal s'ouvre
3. Utilisateur configure les options
4. Calcul automatique du layout optimal
5. Utilisateur clique "Générer PDF"
6. Appel à generatePDF() avec les options
7. Capture du canvas avec html2canvas
8. Création du PDF avec jsPDF
9. Ajout des copies selon le layout
10. Téléchargement du PDF final
```

## Optimisations implémentées

```
Qualité d'image:
- Échelle 4x pour haute résolution
- Format PNG pour qualité maximale
- Paramètres optimisés pour html2canvas

Calcul du layout:
- Algorithme efficace O(n²)
- Test de toutes les configurations possibles
- Sélection de la configuration optimale

Interface utilisateur:
- Calcul en temps réel
- Aperçu des dimensions
- Validation des paramètres
- Messages d'erreur informatifs
```

## Formats de sortie

```
PDF Standard:
- Orientation automatique (portrait/paysage)
- Dimensions exactes en mm
- Qualité d'impression optimale
- Compatible avec toutes les imprimantes

Fichiers générés:
- affiche-simple.pdf (mode simple)
- affiche-multiple-N-copies.pdf (mode duplication)
- affiche-combinee.pdf (mode combinaison)
```

## Gestion des erreurs

```
Erreurs possibles:
- Canvas non trouvé → Message d'erreur
- Dimensions invalides → Validation des paramètres
- Espace insuffisant → Ajustement automatique
- Erreur de génération → Rollback et message

Récupération:
- Validation des paramètres avant génération
- Messages d'erreur explicites
- Suggestions de correction
- Fallback vers mode simple
```
