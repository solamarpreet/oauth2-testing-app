import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const TokenInspector = ({ token, title, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  if (!token) {
    return null;
  }

  let decodedToken = null;
  let decodeError = null;

  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    decodeError = error.message;
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(`${label} copied!`);
        setTimeout(() => setCopySuccess(''), 2000);
      },
      (err) => {
        setCopySuccess('Failed to copy');
      }
    );
  };

  const formatClaimValue = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return value.toString();
  };

  const isJsonValue = (value) => {
    return typeof value === 'object' && value !== null;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch {
      return null;
    }
  };

  return (
    <div className="token-container">
      <div className="token-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{title}</h3>
        <span className={`toggle-icon ${isExpanded ? 'open' : ''}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="token-content">
          <div className="token-raw">
            <strong>Raw {type} Token:</strong>
            <div style={{ marginTop: '10px' }}>{token}</div>
            <button 
              className="copy-button" 
              onClick={() => copyToClipboard(token, 'Token')}
            >
              📋 Copy Token
            </button>
            {copySuccess && <div style={{ color: '#90EE90', marginTop: '10px' }}>{copySuccess}</div>}
          </div>

          {decodeError ? (
            <div className="error-message">
              <strong>Error decoding token:</strong> {decodeError}
            </div>
          ) : decodedToken ? (
            <div className="token-claims">
              <h4>Decoded Claims ({Object.keys(decodedToken).length} claims)</h4>
              
              <div className="claims-grid">
                {/* Standard claims with special formatting */}
                {decodedToken.iat && (
                  <div className="claim-item">
                    <div className="claim-key">iat (Issued At)</div>
                    <div className="claim-value">
                      {decodedToken.iat} → {formatTimestamp(decodedToken.iat)}
                    </div>
                  </div>
                )}
                
                {decodedToken.exp && (
                  <div className="claim-item">
                    <div className="claim-key">exp (Expiration Time)</div>
                    <div className="claim-value">
                      {decodedToken.exp} → {formatTimestamp(decodedToken.exp)}
                    </div>
                  </div>
                )}
                
                {decodedToken.nbf && (
                  <div className="claim-item">
                    <div className="claim-key">nbf (Not Before)</div>
                    <div className="claim-value">
                      {decodedToken.nbf} → {formatTimestamp(decodedToken.nbf)}
                    </div>
                  </div>
                )}

                {/* All other claims */}
                {Object.entries(decodedToken)
                  .filter(([key]) => !['iat', 'exp', 'nbf'].includes(key))
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([key, value]) => (
                    <div key={key} className="claim-item">
                      <div className="claim-key">{key}</div>
                      <div className={`claim-value ${isJsonValue(value) ? 'json' : ''}`}>
                        {formatClaimValue(value)}
                      </div>
                    </div>
                  ))}
              </div>

              <button 
                className="copy-button" 
                onClick={() => copyToClipboard(JSON.stringify(decodedToken, null, 2), 'Claims')}
                style={{ marginTop: '15px' }}
              >
                📋 Copy All Claims (JSON)
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TokenInspector;
