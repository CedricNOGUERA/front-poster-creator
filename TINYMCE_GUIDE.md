# Guide TinyMCE - Éditeur de texte riche

## ✅ Avantages de TinyMCE

- **Compatible React 19** : Pas de problème avec `findDOMNode`
- **Fonctionnalités complètes** : Plus d'options que Quill
- **Stable** : Éditeur mature et bien maintenu
- **Personnalisable** : Configuration flexible
- **Gratuit** : Version de base gratuite

## 🚀 Installation

```bash
npm install @tinymce/tinymce-react
```

## 📝 Utilisation basique

```typescript
import { Editor } from '@tinymce/tinymce-react'

<Editor
  value={text}
  onEditorChange={handleTextChange}
  init={{
    height: 200,
    menubar: false,
    plugins: ['advlist', 'autolink', 'lists', 'link'],
    toolbar: 'bold italic | bullist numlist'
  }}
/>
```

## ⚙️ Configuration avancée

### Toolbar personnalisée
```typescript
toolbar: 'undo redo | formatselect | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help'
```

### Plugins disponibles
- `advlist` : Listes avancées
- `autolink` : Liens automatiques
- `lists` : Listes simples
- `link` : Gestion des liens
- `image` : Insertion d'images
- `table` : Tableaux
- `code` : Affichage du code HTML

## 🎨 Personnalisation

### Styles personnalisés
```typescript
content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
```

### Hauteur de l'éditeur
```typescript
height: 200 // en pixels
```

## 🔧 Test de l'éditeur

Pour tester, ajoutez temporairement :
```typescript
import { TinyMCETest } from './TinyMCETest'
<TinyMCETest />
```

## 📋 Fonctionnalités disponibles

- ✅ **Formatage** : Gras, italique, souligné
- ✅ **Exposant/Indice** : X² et X₂ (double interface)
- ✅ **Alignement** : Gauche, centre, droite, justifié
- ✅ **Listes** : Puces et numérotées
- ✅ **Couleurs** : Texte et arrière-plan
- ✅ **Liens** : Insertion et gestion
- ✅ **Tableaux** : Création et édition
- ✅ **Images** : Insertion d'images
- ✅ **Code** : Affichage du HTML généré

## 🆚 Comparaison avec Quill

| Fonctionnalité | TinyMCE | Quill |
|----------------|---------|-------|
| Compatibilité React 19 | ✅ | ❌ |
| Fonctionnalités | ✅ Plus complètes | ⚠️ Basiques |
| Stabilité | ✅ Très stable | ⚠️ Problèmes React 19 |
| Taille | ⚠️ Plus lourd | ✅ Léger |
| Configuration | ✅ Flexible | ⚠️ Limitée |

## 🎯 Recommandation

**TinyMCE est recommandé** pour votre projet car :
- Compatible avec React 19
- Plus de fonctionnalités
- Plus stable
- Meilleure intégration
