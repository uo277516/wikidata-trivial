import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from 'react-oauth2-code-pkce';

const OAuthLoginContainer = () => {
  const authConfig = {
    clientId: '91cd54bbe219843f9951e1d539fce905',
    authorizationEndpoint: 'https://www.wikidata.org/wiki/Special:OAuth/authorize',
    tokenEndpoint: 'https://www.wikidata.org/oauth/token',
    redirectUri: '/wiki/Special:OAuth/verified',
    scope: 'edit',
    code: 'patata',
    onRefreshTokenExpire: (event) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
  };

  const UserInfo = () => {
    const { token, tokenData } = useContext(AuthContext);

    return (
      <>
        <h4>Access Token</h4>
        <pre>{token}</pre>
        <h4>User Information from JWT</h4>
        <pre>{JSON.stringify(tokenData, null, 2)}</pre>
      </>
    );
  };

  const getToken = (code) => {
    const requestData = {
      client_id: authConfig.clientId,
      code: code,
      redirect_uri: authConfig.redirectUri,
      grant_type: 'authorization_code'
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    };

    fetch(authConfig.tokenEndpoint, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Token de acceso:', data.access_token);
      })
      .catch(error => console.error('Error al obtener el token de acceso:', error));
  };

  return (
    <AuthProvider authConfig={authConfig} onAuthorizationCode={getToken}>
      <UserInfo />
    </AuthProvider>
  );
};

export default OAuthLoginContainer;
