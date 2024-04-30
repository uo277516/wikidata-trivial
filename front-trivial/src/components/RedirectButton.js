import React from 'react';
const oauthSignature = require('oauth-signature');

const RedirectButton = () => {


  const url = 'https://www.mediawiki.org/w/index.php?title=Special:OAuth/initiate';
  const httpMethod = 'GET';
  const parameters = {
    format: 'json',
    oauth_callback: 'oob',
    oauth_consumer_key: '9710c01964941c18292d69c3cd033af2',
    //oauth_consumer_secret: '7d61936d0335c9443f3a041812a25bc948ef29b8',
    oauth_version: '1.0',
    oauth_nonce: generateNonce(),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
  };
    const tokenSecret = '7d61936d0335c9443f3a041812a25bc948ef29b8';

    const encodedSignature = oauthSignature.generate(httpMethod, url, parameters, tokenSecret);

    function generateNonce() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let nonce = '';
      const charactersLength = characters.length;
      for (let i = 0; i < 16; i++) {
        nonce += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return nonce;
    }
    

    parameters.oauth_signature = encodedSignature;

    const redirectUrl = url + '&' + Object.keys(parameters).map(key => `${key}=${encodeURIComponent(parameters[key])}`).join('&');
 

  const handleButtonClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button onClick={handleButtonClick}>Autorizarse en Wikidata</button>
  );
};

export default RedirectButton;
