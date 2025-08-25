# Guide Clé API TinyMCE

## 🔑 Clé API - Optionnelle

**Bonne nouvelle** : Vous pouvez utiliser TinyMCE **sans clé API** ! 

### ✅ Version sans clé API
- Fonctionne parfaitement
- Fonctionnalités de base
- Aucune inscription requise
- Configuration actuelle

### 🆓 Version avec clé API gratuite
Si vous voulez plus de fonctionnalités :

1. **Allez sur** : https://www.tiny.cloud/auth/signup/
2. **Créez un compte gratuit**
3. **Récupérez votre clé API**
4. **Ajoutez-la dans votre projet**

## 📝 Comment ajouter la clé API

### Étape 1 : Créer un fichier .env
```bash
# À la racine de votre projet
VITE_TINYMCE_API_KEY=votre-clé-api-ici
```

### Étape 2 : Redémarrer le serveur
```bash
npm run dev
```

## 🎯 Avantages de la clé API

| Fonctionnalité | Sans clé | Avec clé |
|----------------|----------|----------|
| Éditeur de base | ✅ | ✅ |
| Formatage texte | ✅ | ✅ |
| Couleurs | ✅ | ✅ |
| Listes | ✅ | ✅ |
| Support premium | ❌ | ✅ |
| Plugins avancés | ❌ | ✅ |
| Support client | ❌ | ✅ |

## 🚀 Recommandation

**Commencez sans clé API** - elle fonctionne parfaitement pour votre cas d'usage !

Si plus tard vous avez besoin de fonctionnalités avancées, vous pourrez toujours ajouter une clé API gratuite.

## 🔧 Configuration actuelle

Votre éditeur est configuré pour fonctionner avec ou sans clé API :

```typescript
// Dans src/config/tinymce.ts
API_KEY: import.meta.env.VITE_TINYMCE_API_KEY || '',
```

Si la clé n'est pas définie, elle sera vide et TinyMCE fonctionnera en mode gratuit.
