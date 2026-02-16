import React from 'react';
import { AuthProvider, useAuthContext } from 'react-oauth2-code-pkce';
import { getOAuthConfig } from './config';
import TokenInspector from './components/TokenInspector';

// Main App Content Component
const AppContent = () => {
  const { tokenData, token, idToken, logIn, logOut, error, loginInProgress } = useAuthContext();

  const handleLogin = async () => {
    try {
      await logIn();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    logOut();
  };

  // Check if user is authenticated
  const isAuthenticated = token && tokenData;

  return (
    <div className="app">
      <div className="header">
        <h1>🔐 Microsoft Entra OAuth2 PKCE Testing</h1>
        <p>Authorization Code Flow with PKCE</p>
      </div>

      <div className="content">
        {error && (
          <div className="error-message">
            <strong>Authentication Error:</strong>
            <div style={{ marginTop: '10px' }}>{error}</div>
          </div>
        )}

        {loginInProgress && (
          <div className="loading">
            Authenticating... Please wait.
          </div>
        )}

        {!isAuthenticated && !loginInProgress && (
          <div className="auth-section">
            <h2 style={{ marginBottom: '20px', color: '#495057' }}>
              Please sign in to test the OAuth2 flow
            </h2>
            <p style={{ marginBottom: '30px', color: '#6c757d' }}>
              This will initiate the Authorization Code Flow with PKCE to Microsoft Entra
            </p>
            <button className="button" onClick={handleLogin}>
              🚀 Login with Microsoft
            </button>
            <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px', textAlign: 'left' }}>
              <strong style={{ color: '#856404' }}>⚠️ Configuration Required:</strong>
              <p style={{ color: '#856404', marginTop: '10px', fontSize: '0.9rem' }}>
                Before using this app, create a <code>.env</code> file with your:
              </p>
              <ul style={{ color: '#856404', marginTop: '10px', marginLeft: '20px', fontSize: '0.9rem' }}>
                <li>Azure AD Application (Client) ID</li>
                <li>Azure AD Tenant ID</li>
                <li>OAuth Scopes</li>
                <li>Redirect URI (should be http://localhost:3000)</li>
              </ul>
              <p style={{ color: '#856404', marginTop: '10px', fontSize: '0.9rem' }}>
                Copy <code>.env.example</code> to <code>.env</code> and fill in your values.
              </p>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="user-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>✅ Authentication Successful</h2>
                <button className="button secondary" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>

              <div className="user-details">
                {tokenData.name && (
                  <div className="user-detail">
                    <strong>Name</strong>
                    <span>{tokenData.name}</span>
                  </div>
                )}
                
                {tokenData.email && (
                  <div className="user-detail">
                    <strong>Email</strong>
                    <span>{tokenData.email}</span>
                  </div>
                )}
                
                {tokenData.preferred_username && (
                  <div className="user-detail">
                    <strong>Username</strong>
                    <span>{tokenData.preferred_username}</span>
                  </div>
                )}
                
                {tokenData.sub && (
                  <div className="user-detail">
                    <strong>Subject (sub)</strong>
                    <span>{tokenData.sub}</span>
                  </div>
                )}
                
                {tokenData.tid && (
                  <div className="user-detail">
                    <strong>Tenant ID</strong>
                    <span>{tokenData.tid}</span>
                  </div>
                )}
                
                {tokenData.oid && (
                  <div className="user-detail">
                    <strong>Object ID</strong>
                    <span>{tokenData.oid}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="tokens-section">
              <h2>🔑 Token Inspector</h2>
              <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                Click on each token below to view the raw JWT and decoded claims
              </p>

              <TokenInspector 
                token={idToken} 
                title="ID Token" 
                type="ID"
              />

              <TokenInspector 
                token={token} 
                title="Access Token" 
                type="Access"
              />
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#d1ecf1', borderRadius: '8px', borderLeft: '4px solid #0c5460' }}>
              <h3 style={{ color: '#0c5460', marginBottom: '10px' }}>📝 About This Flow</h3>
              <p style={{ color: '#0c5460', fontSize: '0.9rem', lineHeight: '1.6' }}>
                This application demonstrates the OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange).
                PKCE enhances security by preventing authorization code interception attacks, making it suitable for public clients
                like single-page applications and mobile apps.
              </p>
              <p style={{ color: '#0c5460', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '10px' }}>
                The tokens displayed above contain claims about the authenticated user and the granted permissions.
                The ID Token contains user identity information, while the Access Token is used to access protected resources.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main App Component with AuthProvider
function App() {
  const authConfig = getOAuthConfig();

  return (
    <AuthProvider authConfig={authConfig}>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
