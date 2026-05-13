import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // --- PROPRETÉ ET LOGIQUE ---
      "no-console": ["warn", { allow: ["warn", "error"] }], 
      // Alerte sur les console.log qui traînent, mais autorise les erreurs/warnings pour le debug en prod.
      
      "prefer-const": "error", 
      // Empêche l'usage de 'let' si la variable n'est jamais réassignée (immuabilité).

      "no-debugger": "error",
      // Interdit le mot-clé 'debugger' qui pourrait bloquer l'exécution en production.

      "eqeqeq": ["error", "always"],
      // Force l'utilisation de === et !== au lieu de == et != pour éviter les bugs de coercition de type.

        // --- TYPESCRIPT ---
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // Ignore les variables non utilisées si elles commencent par un underscore (ex: _data).

      "@typescript-eslint/no-explicit-any": "warn",
      // Encourage à typer précisément au lieu d'utiliser 'any', le grand ennemi de TypeScript.

    },
  },
)
