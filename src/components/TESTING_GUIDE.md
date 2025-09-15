# 🧪 Guide de test - Fonctionnalité de combinaison de PDFs

## Problème résolu

La fonctionnalité de combinaison de PDFs ne fonctionnait pas correctement. Seul le PDF en édition était présent sur la page, mais pas les PDFs sélectionnés avec l'input de type file.

## Solution implémentée

### 1. Installation des dépendances
```bash
npm install pdfjs-dist
```

### 2. Nouveau fichier : `pdfConverter.ts`
- Conversion des PDFs en images utilisant PDF.js
- Calcul automatique des dimensions
- Redimensionnement intelligent avec conservation des proportions

### 3. Amélioration de `printUtils.ts`
- Fonction `generateCombinedPDF` complètement réécrite
- Traitement réel des PDFs uploadés
- Disposition intelligente sur la page
- Gestion des erreurs robuste

### 4. Amélioration de `PrintOptionsModal.tsx`
- Aperçu des PDFs uploadés
- Indicateurs de statut (processing, ready, error)
- Validation avant génération
- Interface utilisateur améliorée

## Comment tester

### Étape 1 : Accéder aux options d'impression
1. Ouvrez n'importe quel éditeur d'affiches
2. Cliquez sur "Options d'impression"

### Étape 2 : Tester le mode combinaison
1. Sélectionnez "Combinaison de PDFs"
2. Choisissez un format de page (A4 recommandé)
3. Cliquez sur "Ajouter des PDFs à combiner"
4. Sélectionnez un ou plusieurs fichiers PDF

### Étape 3 : Vérifier le traitement
- Les PDFs apparaissent avec un indicateur de chargement
- Une fois traités, un aperçu miniature s'affiche
- Les dimensions sont calculées automatiquement
- Les erreurs sont affichées clairement

### Étape 4 : Générer le PDF
1. Cliquez sur "Générer PDF"
2. Le système combine l'affiche actuelle avec les PDFs uploadés
3. Téléchargez le fichier "affiche-combinee.pdf"

## Vérifications à effectuer

### ✅ Fonctionnalités de base
- [ ] Les PDFs uploadés sont traités correctement
- [ ] Les aperçus s'affichent après traitement
- [ ] Les dimensions sont calculées automatiquement
- [ ] Le bouton de génération est désactivé pendant le traitement

### ✅ Génération du PDF
- [ ] L'affiche actuelle est présente dans le PDF
- [ ] Les PDFs uploadés sont inclus dans le PDF
- [ ] La disposition est intelligente (pas de débordement)
- [ ] Les proportions sont conservées
- [ ] L'espacement est correct

### ✅ Gestion des erreurs
- [ ] Les PDFs corrompus sont gérés gracieusement
- [ ] Les messages d'erreur sont informatifs
- [ ] Le système continue même si un PDF échoue
- [ ] Les validations empêchent les actions invalides

## Cas de test spécifiques

### Test 1 : PDF simple
- Uploadez un PDF A4 standard
- Vérifiez qu'il s'affiche correctement
- Vérifiez qu'il est inclus dans le PDF final

### Test 2 : PDFs multiples
- Uploadez 2-3 PDFs de tailles différentes
- Vérifiez que tous sont traités
- Vérifiez la disposition sur la page

### Test 3 : PDFs de grandes tailles
- Uploadez un PDF avec de grandes dimensions
- Vérifiez le redimensionnement automatique
- Vérifiez que les proportions sont conservées

### Test 4 : PDFs corrompus
- Uploadez un fichier PDF corrompu
- Vérifiez que l'erreur est gérée
- Vérifiez que les autres PDFs fonctionnent toujours

## Dépannage

### Problème : PDFs ne se chargent pas
**Solution :** Vérifiez que le fichier est bien un PDF valide

### Problème : Aperçu ne s'affiche pas
**Solution :** Vérifiez la console pour les erreurs PDF.js

### Problème : PDF final ne contient que l'affiche
**Solution :** Vérifiez que les PDFs ont le statut "ready" avant génération

### Problème : Disposition incorrecte
**Solution :** Ajustez l'espacement ou le format de page

## Améliorations futures

1. **Support multi-pages** : Traiter toutes les pages d'un PDF
2. **Prévisualisation avancée** : Aperçu de la disposition finale
3. **Templates de disposition** : Dispositions prédéfinies
4. **Drag & drop** : Interface de réorganisation
5. **Compression** : Optimisation de la taille des fichiers

## Fichiers modifiés

- `front/src/utils/pdfConverter.ts` (nouveau)
- `front/src/utils/printUtils.ts` (modifié)
- `front/src/components/PrintOptionsModal.tsx` (modifié)
- `front/src/components/PrintTestComponent.tsx` (nouveau)

## Dépendances ajoutées

- `pdfjs-dist` : Pour parser et convertir les PDFs
