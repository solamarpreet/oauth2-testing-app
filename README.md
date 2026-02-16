# Microsoft Entra OAuth2 PKCE Testing Application

A React application to test Microsoft Entra (Azure AD) OAuth2 authorization code flow with PKCE.

## Features

- Authorization Code Flow with PKCE
- Token inspection (ID token and Access token)
- Claims viewer
- JWT decoding

## Setup

1. Register an application in Microsoft Entra (Azure AD):
   - Go to Azure Portal > Azure Active Directory > App registrations
   - Create a new registration
   - Set redirect URI to: `http://localhost:3000` (use **SPA platform**, not Web)
   - Note the Application (client) ID and Tenant ID

2. Configure environment variables:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your values
   nano .env
   ```
   
   Or manually create `.env` with:
   ```
   VITE_CLIENT_ID=your-client-id
   VITE_TENANT_ID=your-tenant-id
   VITE_REDIRECT_URI=http://localhost:3000
   VITE_OAUTH_SCOPES=openid profile email api://your-client-id/access_as_user
   VITE_AUTO_LOGIN=false
   VITE_STORAGE=local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Configuration

The OAuth2 configuration is loaded from environment variables in the `.env` file. Available variables:

- **VITE_CLIENT_ID**: Your Azure AD application (client) ID
- **VITE_TENANT_ID**: Your Azure AD tenant ID (or 'common' for multi-tenant)
- **VITE_REDIRECT_URI**: Must match the redirect URI configured in Azure AD
- **VITE_OAUTH_SCOPES**: Space-separated list of OAuth scopes
- **VITE_AUTO_LOGIN**: Set to 'true' to automatically trigger login on page load
- **VITE_STORAGE**: 'local' for localStorage or 'session' for sessionStorage

### Scope Configuration

**For custom API with app roles:**
```
VITE_OAUTH_SCOPES=openid profile email api://your-client-id/access_as_user
```

**For Microsoft Graph API:**
```
VITE_OAUTH_SCOPES=openid profile email User.Read Mail.Read
```

**⚠️ Important:** Don't mix Graph API scopes with custom API scopes in the same request. Azure AD will return an access token for only one resource (usually Graph). Request them separately if you need both.

## Usage

1. Click "Login with Microsoft" to initiate the OAuth2 flow
2. After successful authentication, you'll see your tokens displayed
3. Click on each token to view the decoded claims
4. Use the "Logout" button to clear the session
