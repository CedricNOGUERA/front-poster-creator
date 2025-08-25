# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Générateur de Bons Plans

## Éditeur de Texte Riche

Le projet utilise **Quill.js** comme éditeur de texte riche pour une meilleure expérience utilisateur lors de la création de templates.

### Fonctionnalités de l'éditeur

- **Formatage de base** : Gras, italique, souligné
- **Exposants et indices** : Support des scripts supérieurs et inférieurs
- **Couleurs** : Sélecteur de couleur intégré
- **Interface intuitive** : Barre d'outils Bootstrap-friendly

### Installation

```bash
npm install react-quill --legacy-peer-deps
```

### Utilisation

L'éditeur est intégré dans le composant `TextEditor.tsx` et remplace l'ancien textarea basique.

### Configuration

L'éditeur est configuré avec les modules suivants :
- Toolbar personnalisée avec les outils essentiels
- Styles CSS personnalisés pour l'intégration Bootstrap
- Support des formats HTML pour l'export PDF

### Avantages de Quill.js

- ✅ **Léger** : ~200KB vs 1MB+ pour CKEditor
- ✅ **Simple** : API intuitive et facile à intégrer
- ✅ **Personnalisable** : Toolbar et styles adaptables
- ✅ **Performance** : Idéal pour un éditeur en ligne
- ✅ **HTML natif** : Compatible avec `dangerouslySetInnerHTML`

### Alternatives considérées

- **Draft.js** : Plus complexe, API verbeuse
- **CKEditor 5** : Trop lourd pour ce cas d'usage
- **Quill.js** : **Recommandé** pour ce projet
