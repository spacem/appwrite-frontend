## Auth UI

This project includes an extendable Appwrite Auth UI supporting:

- Email/Password (register + login)
- OAuth (GitHub, Discord, Google out of the box)
 - Magic Link (email)
 - OTP (email)
- Anonymous sessions
- Session controls (extend, logout)

### Adding a new OAuth provider

1. In Appwrite console, enable the provider and enter Client ID/Secret.
2. Add your site/app URLs to Project → Platforms so redirects are allowed.
3. Update `src/components/auth/ProviderButtons.tsx`:
  - Add the provider key to `OAuthProviderKey` union.
  - Map the key to `OAuthProvider.<Name>` in `providerToEnum`.
  - Add the key to `enabledProviders` in `src/pages/AuthPage.tsx`.

That’s it—the button will appear and use Appwrite’s default flow.

### Magic Link and OTP callbacks

Magic Link and Phone OTP redirect back to your app with `userId` and `secret` query params. `AuthPage` detects these and finalizes the session using Appwrite’s `updateMagicURLSession` or `createSession` in the OTP forms.

### Email login UX (code-first)

The "Continue with Email" screen offers a single email field and two login methods:

- Code (default): Sends a one-time code to the email. After sending, a code input appears with a Verify button. A Resend button is shown with a short cooldown.
- Password: Traditional email/password auth. Registration uses email + password as well.

Phone-based OTP was removed to avoid Appwrite plan limits; the code option is email-only.

### Password recovery

Password reset uses Appwrite Recovery under the hood. When Appwrite redirects back with `userId` and `secret` in the URL, a small modal prompts for a new password and completes `updateRecovery`, then clears the URL params.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
