# Guide - Fonctionnalités Exposant/Indice

## 🆕 Nouvelles fonctionnalités ajoutées

### ✅ Exposant (X²)
- **Bouton dans la barre d'outils** : Icône X² dans TinyMCE
- **Bouton personnalisé** : Bouton Bootstrap avec X²
- **Utilisation** : Sélectionnez du texte → cliquez sur le bouton

### ✅ Indice (X₂)
- **Bouton dans la barre d'outils** : Icône X₂ dans TinyMCE
- **Bouton personnalisé** : Bouton Bootstrap avec X₂
- **Utilisation** : Sélectionnez du texte → cliquez sur le bouton

## 🎯 Comment utiliser

### Méthode 1 : Barre d'outils TinyMCE
1. **Sélectionnez** le texte à mettre en exposant/indice
2. **Cliquez** sur l'icône X² ou X₂ dans la barre d'outils
3. **Le texte** est automatiquement formaté

### Méthode 2 : Boutons personnalisés
1. **Sélectionnez** le texte à mettre en exposant/indice
2. **Cliquez** sur le bouton X² (exposant) ou X₂ (indice)
3. **Le texte** est automatiquement formaté

## 📝 Exemples d'utilisation

### Exposant
- **Prix** : 1000 F → 1000<sup>F</sup>
- **Puissances** : x2 → x<sup>2</sup>
- **Références** : Note 1 → Note<sup>1</sup>

### Indice
- **Formules** : H2O → H<sub>2</sub>O
- **Références** : Page 1 → Page<sub>1</sub>
- **Indices** : x1 → x<sub>1</sub>

## 🔧 Configuration technique

### Barre d'outils TinyMCE
```typescript
toolbar: 'bold italic underline | superscript subscript | forecolor backcolor | ...'
```

### Boutons personnalisés
```typescript
const addSuperscript = () => {
  if (editorRef) {
    editorRef.execCommand('mceInsertContent', false, '<sup>' + editorRef.selection.getContent() + '</sup>')
  }
}
```

## 🎨 Rendu HTML

### Exposant
```html
<sup>texte en exposant</sup>
```

### Indice
```html
<sub>texte en indice</sub>
```

## 🚀 Avantages

- ✅ **Double interface** : Barre d'outils + boutons personnalisés
- ✅ **Facile à utiliser** : Sélection → clic
- ✅ **Compatible** : Fonctionne avec l'export PDF
- ✅ **Flexible** : Peut être appliqué à n'importe quel texte

## 💡 Conseils d'utilisation

1. **Sélectionnez d'abord** le texte avant de cliquer
2. **Utilisez les deux méthodes** selon votre préférence
3. **Testez l'export** pour vérifier le rendu
4. **Évitez les abus** - utilisez avec modération pour la lisibilité
