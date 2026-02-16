// OAuth2 Configuration for Microsoft Entra (Azure AD)
// Configuration values are loaded from environment variables (.env file)
// See .env.example for template

// Read from environment variables with fallbacks
const clientId = import.meta.env.VITE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const tenantId = import.meta.env.VITE_TENANT_ID || 'YOUR_TENANT_ID_HERE';
const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000';
const scopes = import.meta.env.VITE_OAUTH_SCOPES || 'openid profile email';
const autoLogin = import.meta.env.VITE_AUTO_LOGIN === 'true';
const storage = import.meta.env.VITE_STORAGE || 'local';

export const oauthConfig = {
  // Your Azure AD Application (client) ID
  clientId,
  
  // Your Azure AD Tenant ID
  tenantId,
  
  // Authorization endpoint - uses the tenant ID
  // For multi-tenant apps, you can use 'common' instead of tenant ID
  authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  
  // Token endpoint
  tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  
  // Redirect URI - must match what's configured in Azure AD
  redirectUri,
  
  // Scopes to request
  // NOTE: When mixing Graph API scopes (User.Read) with custom API scopes,
  // Azure AD returns access token for Graph, not your custom API
  // Use only custom API scope to get access token with your app roles
  scope: scopes,
  
  // Auto login on mount
  autoLogin,
  
  // Where to redirect after logout
  logoutRedirect: window.location.origin,
  
  // Decode token automatically
  decodeToken: true,
  
  // Token storage in localStorage or sessionStorage
  storage
};

// Helper function to get the full configuration
export const getOAuthConfig = () => {
  // You can dynamically update the endpoints if tenant ID changes
  const config = { ...oauthConfig };
  
  if (config.tenantId && config.tenantId !== 'YOUR_TENANT_ID_HERE') {
    config.authorizationEndpoint = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize`;
    config.tokenEndpoint = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  }
  
  return config;
};
