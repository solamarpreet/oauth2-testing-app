# Project Structure Documentation

## Overview

This is a React-based OAuth2 testing application for Microsoft Entra (Azure AD) that implements the Authorization Code Flow with PKCE. The application allows developers to test the OAuth2 flow, inspect tokens, and view decoded claims.

**Tech Stack:**
- React 19.2
- Vite 7.3 (Build tool)
- react-oauth2-code-pkce 1.23.4 (OAuth2 library)
- jwt-decode 4.0 (JWT decoding)

---

## Directory Structure

```
oauth2-testing-app/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── README.md                    # Setup and usage instructions
├── PROJECT_STRUCTURE.md         # This file
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── src/
    ├── main.jsx                 # React app initialization
    ├── index.css                # Global styles
    ├── config.js                # OAuth2 configuration
    ├── App.jsx                  # Main application component
    └── components/
        └── TokenInspector.jsx   # Token viewing component
```

---

## File Descriptions

### Root Level Files

#### `index.html`
- **Purpose**: HTML entry point for the SPA
- **Key Elements**:
  - Root div (`#root`) where React mounts
  - Loads `src/main.jsx` as ES module
  - Minimal setup, most UI is React-driven

#### `package.json`
- **Purpose**: Project dependencies and npm scripts
- **Key Dependencies**:
  - `react` & `react-dom`: Core React libraries
  - `react-oauth2-code-pkce`: Handles OAuth2 PKCE flow
  - `jwt-decode`: Decodes JWT tokens without verification
- **Dev Dependencies**:
  - `vite`: Fast build tool and dev server
  - `@vitejs/plugin-react`: Vite plugin for React support
- **Scripts**:
  - `npm run dev`: Start development server (port 3000)
  - `npm run build`: Production build
  - `npm run preview`: Preview production build

#### `vite.config.js`
- **Purpose**: Vite build tool configuration
- **Settings**:
  - React plugin enabled
  - Dev server port set to 3000 (matches redirect URI)
- **Modifications**: Change port here if using different redirect URI

#### `.env`
- **Purpose**: Environment variables for application configuration
- **Contains**: Sensitive configuration values (client ID, tenant ID, scopes)
- **Important**: This file is in .gitignore and should NOT be committed to version control
- **Variables**: All must be prefixed with `VITE_` to be accessible in client code
  - `VITE_CLIENT_ID`: Azure AD application client ID
  - `VITE_TENANT_ID`: Azure AD tenant ID
  - `VITE_REDIRECT_URI`: OAuth redirect URI
  - `VITE_OAUTH_SCOPES`: Space-separated OAuth scopes
  - `VITE_AUTO_LOGIN`: Auto-login flag ('true'/'false')
  - `VITE_STORAGE`: Token storage type ('local'/'session')
- **Access in Code**: `import.meta.env.VITE_*`
- **Modifications**: Edit values directly in this file (never commit it!)

#### `.env.example`
- **Purpose**: Template for creating .env file
- **Contains**: Example/placeholder values
- **Usage**: Copy to `.env` and fill in actual values
- **Safe to Commit**: Yes, this template should be in version control
- **When to Update**: Add new variables here when adding new config options

### Source Files (`src/`)

#### `src/main.jsx`
- **Purpose**: Application entry point
- **Functionality**:
  - Creates React root
  - Renders `App` component in StrictMode
  - Imports global CSS
- **Rarely Modified**: Only change if adding global providers or changing app initialization

#### `src/index.css`
- **Purpose**: Global styles for the entire application
- **Styling Approach**: Custom CSS (no framework)
- **Key Sections**:
  - Base resets and body styles
  - App layout and header styles
  - Button styles with gradient theme
  - User info display styles
  - Token container and viewer styles
  - Claims display styles
  - Error and loading states
- **Theme Colors**:
  - Primary gradient: `#667eea` to `#764ba2`
  - Background: White with rounded corners
  - Accent: Various shades for different sections
- **Modifications**: 
  - Change colors in gradient definitions
  - Adjust spacing in padding/margin values
  - Modify responsiveness in media queries (currently uses CSS Grid auto-fit)

#### `src/config.js`
- **Purpose**: OAuth2 configuration for Microsoft Entra
- **Configuration Source**: Reads from environment variables (.env file)
- **Exports**:
  1. `oauthConfig` - Configuration object built from env vars
  2. `getOAuthConfig()` - Helper function that returns config with dynamic endpoints
  
- **Environment Variables** (all prefixed with `VITE_` for Vite):
  ```javascript
  VITE_CLIENT_ID          // Azure AD App Client ID
  VITE_TENANT_ID          // Azure AD Tenant ID
  VITE_REDIRECT_URI       // Redirect URI after auth
  VITE_OAUTH_SCOPES       // Space-separated scopes
  VITE_AUTO_LOGIN         // 'true' or 'false'
  VITE_STORAGE            // 'local' or 'session'
  ```

- **Configuration Properties**:
  ```javascript
  {
    clientId: string           // From VITE_CLIENT_ID
    tenantId: string           // From VITE_TENANT_ID
    authorizationEndpoint: string  // Built using tenantId
    tokenEndpoint: string      // Built using tenantId
    redirectUri: string        // From VITE_REDIRECT_URI
    scope: string              // From VITE_OAUTH_SCOPES
    autoLogin: boolean         // From VITE_AUTO_LOGIN
    logoutRedirect: string     // window.location.origin
    decodeToken: boolean       // true (hardcoded)
    storage: string            // From VITE_STORAGE
  }
  ```

- **Key Modifications**:
  - Edit `.env` file with your actual values (don't commit this file!)
  - Use `.env.example` as a template
  - Change `VITE_OAUTH_SCOPES` to request different permissions
  - Use `'common'` as VITE_TENANT_ID for multi-tenant apps
  - Set `VITE_AUTO_LOGIN=true` to automatically trigger login
  - Change `VITE_REDIRECT_URI` if hosting on different port/domain
  - Set `VITE_STORAGE=session` to clear tokens on browser close

#### `src/App.jsx`
- **Purpose**: Main application component with authentication logic
- **Structure**:
  - `App` component: Wraps everything with `AuthProvider`
  - `AppContent` component: Main UI that uses authentication hooks

- **Key Hooks from `react-oauth2-code-pkce`**:
  ```javascript
  const { 
    tokenData,        // Decoded token data (from ID token)
    token,            // Access token (raw JWT)
    idToken,          // ID token (raw JWT)
    logIn,            // Function to trigger login
    logOut,           // Function to logout
    error,            // Authentication errors
    loginInProgress   // Boolean for loading state
  } = useAuthContext();
  ```

- **UI States**:
  1. **Not Authenticated**: Shows login button and configuration warning
  2. **Login In Progress**: Shows loading message
  3. **Authenticated**: Shows user info and token inspectors
  4. **Error**: Shows error message

- **User Information Displayed**:
  - Name (`tokenData.name`)
  - Email (`tokenData.email`)
  - Username (`tokenData.preferred_username`)
  - Subject ID (`tokenData.sub`)
  - Tenant ID (`tokenData.tid`)
  - Object ID (`tokenData.oid`)

- **Modifications**:
  - Add more user fields by accessing `tokenData.<claim_name>`
  - Add custom logic in `handleLogin()` or `handleLogout()`
  - Modify UI layout in the JSX return sections
  - Add API calls after successful authentication

#### `src/components/TokenInspector.jsx`
- **Purpose**: Display and decode JWT tokens
- **Props**:
  - `token` (string): Raw JWT token
  - `title` (string): Display title (e.g., "ID Token")
  - `type` (string): Token type for labeling

- **Features**:
  1. **Collapsible Display**: Click to expand/collapse token details
  2. **Raw Token View**: Shows full JWT string
  3. **Decoded Claims**: Displays all claims from token payload
  4. **Copy to Clipboard**: Copy raw token or decoded JSON
  5. **Special Formatting**:
     - Timestamps (`iat`, `exp`, `nbf`) converted to readable dates
     - JSON objects displayed with syntax highlighting
     - Claims sorted alphabetically (except timestamps first)

- **State**:
  - `isExpanded`: Controls visibility of token details
  - `copySuccess`: Shows copy confirmation message

- **Error Handling**:
  - Catches JWT decode errors
  - Displays error message if token is invalid

- **Modifications**:
  - Add more special claim formatting in `formatTimestamp()` section
  - Add claim documentation/tooltips
  - Add token validation (expiry warnings)
  - Filter sensitive claims from display
  - Add search/filter functionality for claims

---

## OAuth2 Flow Explanation

### How PKCE Works in This App

1. **User Clicks Login**:
   - `react-oauth2-code-pkce` generates:
     - `code_verifier`: Random string
     - `code_challenge`: SHA-256 hash of verifier
   - Stores `code_verifier` in localStorage

2. **Authorization Request**:
   - Redirects to Microsoft's authorization endpoint
   - Includes `code_challenge` and `code_challenge_method=S256`
   - User authenticates with Microsoft

3. **Authorization Code Returned**:
   - Microsoft redirects back to `redirectUri` with `code` parameter
   - Library detects code in URL

4. **Token Exchange**:
   - Library automatically calls token endpoint
   - Sends authorization code + original `code_verifier`
   - Microsoft verifies the code_challenge matches
   - Returns ID token and access token

5. **Tokens Stored**:
   - Tokens saved to localStorage (configurable)
   - Application state updated
   - User is authenticated

### Security Benefits of PKCE

- **No Client Secret**: Safe for public clients (SPAs, mobile apps)
- **Code Interception Protection**: Even if authorization code is stolen, attacker cannot exchange it without the code_verifier
- **Dynamic per-request**: New challenge generated for each login

---

## Common Modifications

### 1. Adding More Scopes

**File**: `.env`

```
VITE_OAUTH_SCOPES=openid profile email User.Read Mail.Read Calendars.Read
```

Microsoft Graph API scopes: https://learn.microsoft.com/en-us/graph/permissions-reference

**Restart the dev server** after changing .env values.

### 2. Calling Microsoft Graph API

**File**: `src/App.jsx`

Add after successful authentication:

```javascript
const { token } = useAuthContext();

const callGraphAPI = async () => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
};
```

### 3. Multi-Tenant Support

**File**: `.env`

```
VITE_TENANT_ID=common
```

The authorization and token endpoints will be automatically built using 'common'.

**Restart the dev server** after this change.

### 4. Auto-Login on Page Load

**File**: `.env`

```
VITE_AUTO_LOGIN=true
```

**Restart the dev server** after this change.

### 5. Using Session Storage Instead of Local Storage

**File**: `.env`

```
VITE_STORAGE=session
```

Tokens will be cleared when browser tab closes.

**Restart the dev server** after this change.

### 6. Changing Port

**File**: `vite.config.js`
```javascript
server: {
  port: 5000  // Change from 3000
}
```

**File**: `.env`
```
VITE_REDIRECT_URI=http://localhost:5000
```

**Azure AD**: Update redirect URI in app registration

**Restart the dev server** after these changes.

### 7. Adding Token Refresh

The `react-oauth2-code-pkce` library handles token refresh automatically when using `refresh_token` scope. To enable:

**File**: `.env`
```
VITE_OAUTH_SCOPES=openid profile email offline_access User.Read
```

Add `offline_access` scope to get refresh tokens.

**Restart the dev server** after this change.

### 8. Custom Error Handling

**File**: `src/App.jsx`

```javascript
const handleLogin = async () => {
  try {
    await login();
  } catch (err) {
    console.error('Login error:', err);
    // Add custom error handling here
    if (err.message.includes('popup_blocked')) {
      alert('Please allow popups for this site');
    }
  }
};
```

### 9. Adding More Token Claims to Display

**File**: `src/App.jsx`

In the user details section, add:

```javascript
{tokenData.roles && (
  <div className="user-detail">
    <strong>Roles</strong>
    <span>{tokenData.roles.join(', ')}</span>
  </div>
)}
```

---

## Debugging Tips

### 1. Check Browser Console
- Look for errors from `react-oauth2-code-pkce`
- Check network tab for failed API calls

### 2. Verify Configuration
- Ensure client ID and tenant ID are correct
- Confirm redirect URI matches Azure AD exactly (including protocol and port)

### 3. Check Token Storage
- Open DevTools → Application → Local Storage
- Look for `ROCP_` prefixed keys
- Contains token data and PKCE verifier

### 4. Azure AD Errors
Common error codes:
- `AADSTS50011`: Redirect URI mismatch
- `AADSTS700016`: Application not found (wrong client ID)
- `AADSTS90008`: Tenant not found (wrong tenant ID)

### 5. CORS Issues
If calling Microsoft Graph API, ensure:
- Using correct authorization header format
- Token has required scopes
- Endpoint URL is correct

---

## Package Exports

### From `react-oauth2-code-pkce`

```javascript
import { 
  AuthProvider,      // Wrapper component
  useAuthContext,    // Hook for auth state
  AuthContext,       // Auth context (rarely used directly)
  TTokenData         // TypeScript type
} from 'react-oauth2-code-pkce';
```

### From `jwt-decode`

```javascript
import { jwtDecode } from 'jwt-decode';

const decoded = jwtDecode(token);  // Returns payload object
```

**Note**: `jwt-decode` only decodes, does NOT verify signatures. Verification happens server-side by Azure AD.

---

## Environment Variables

Environment variables are used to configure the OAuth2 settings without hardcoding sensitive values.

### Setup

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```
   VITE_CLIENT_ID=your-actual-client-id
   VITE_TENANT_ID=your-actual-tenant-id
   VITE_REDIRECT_URI=http://localhost:3000
   VITE_OAUTH_SCOPES=openid profile email api://your-client-id/access_as_user
   VITE_AUTO_LOGIN=false
   VITE_STORAGE=local
   ```

3. **Restart dev server** after changing .env values

### Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLIENT_ID` | Azure AD Application (client) ID | `your-client-id-here` |
| `VITE_TENANT_ID` | Azure AD Tenant ID (or 'common') | `your-tenant-id-here` |
| `VITE_REDIRECT_URI` | OAuth redirect URI | `http://localhost:3000` |
| `VITE_OAUTH_SCOPES` | Space-separated OAuth scopes | `openid profile email User.Read` |
| `VITE_AUTO_LOGIN` | Auto-trigger login ('true'/'false') | `false` |
| `VITE_STORAGE` | Token storage type ('local'/'session') | `local` |

### Security Notes

- ✅ `.env` is in `.gitignore` - never commit it!
- ✅ `.env.example` is safe to commit (template only)
- ✅ All client-side env vars must be prefixed with `VITE_`
- ⚠️ Even with env vars, client IDs are public in SPAs (this is normal)
- ⚠️ Never put client secrets in .env (SPAs don't use secrets)

---

## Production Deployment

### Build for Production

```bash
npm run build
```

Creates optimized bundle in `dist/` folder.

### Deployment Checklist

1. **Update redirect URI** in Azure AD with production URL
2. **Configure production environment variables**:
   - Create `.env.production` or use hosting platform's env var settings
   - Update `VITE_REDIRECT_URI` with production URL
   - Ensure all `VITE_*` variables are set
3. **Use environment variables** for all sensitive config (already implemented)
4. **Enable HTTPS** (required by OAuth2 in production)
5. **Set appropriate scopes** (don't request more than needed)
6. **Configure CORS** if calling APIs from different domain

### Hosting Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages, Azure Static Web Apps
- **Requirements**: 
  - SPA routing support (redirect all routes to index.html)
  - HTTPS enabled
  - Environment variable support (for secrets)

---

## Testing

### Manual Testing Checklist

- [ ] Login successful with valid credentials
- [ ] Tokens displayed correctly
- [ ] ID token claims visible and accurate
- [ ] Access token claims visible and accurate
- [ ] Copy to clipboard works
- [ ] Timestamp claims formatted as dates
- [ ] Logout clears tokens
- [ ] Error messages display for auth failures
- [ ] Redirect URI handling works
- [ ] Page refresh maintains session (if using localStorage)

### Test Different Scenarios

1. **First-time login**: Clear localStorage before testing
2. **Login with different accounts**: Test tenant restrictions
3. **Expired tokens**: Wait for token expiry
4. **Network failures**: Simulate offline mode
5. **Browser compatibility**: Test in Chrome, Firefox, Safari, Edge

---

## Additional Resources

- **Microsoft Entra Documentation**: https://learn.microsoft.com/en-us/entra/
- **OAuth 2.0 PKCE Spec**: https://datatracker.ietf.org/doc/html/rfc7636
- **react-oauth2-code-pkce**: https://github.com/soofstad/react-oauth2-pkce
- **Microsoft Graph Explorer**: https://developer.microsoft.com/en-us/graph/graph-explorer

---

## Version History

- **v1.1.0** (2026-02-16): Environment variables implementation
  - Added .env and .env.example files
  - Configuration now loaded from environment variables
  - Updated documentation for env-based configuration
  - All sensitive values externalized

- **v1.2.0** (2026-02-16): Dependency updates
  - React 19.2 with Vite 7.3
  - Updated react-oauth2-code-pkce to 1.23.4
  - Updated @vitejs/plugin-react to 5.1.4
  - Fixed deprecated `login` → `logIn` API usage
  - Resolved esbuild security vulnerability

- **v1.0.0** (2026-02-16): Initial project structure
  - React 18.2 with Vite
  - OAuth2 PKCE flow implementation
  - Token inspection with claims viewer
  - Copy to clipboard functionality
  - Responsive UI design
