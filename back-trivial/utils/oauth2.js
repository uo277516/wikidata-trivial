const axios = require('axios');
const crypto = require('crypto');
const oauthSignature = require('oauth-signature');

// Valores de la solicitud
const httpMethod = 'GET';
const url = 'https://www.mediawiki.org/wiki/Special:OAuth/initiate?';
const parameters = {
  oauth_callback: 'http://localhost:3000/',
  oauth_consumer_key: '9710c01964941c18292d69c3cd033af2',
  oauth_token: '7d61936d0335c9443f3a041812a25bc948ef29b8',
  oauth_nonce: 'kllo9940pd9333jh',
  oauth_timestamp: Math.floor(Date.now() / 1000), // Timestamp actual en segundos
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version: '1.0'
};
const consumerSecret = '9710c01964941c18292d69c3cd033af2';
const tokenSecret = '7d61936d0335c9443f3a041812a25bc948ef29b8';

// Generar firma OAuth 1.0a
const encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
const signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {
  encodeSignature: false
});

// Agregar la firma a los parámetros de la solicitud
parameters.oauth_signature = encodedSignature;

// Construir la URL de la solicitud
const requestUrl = url + '?' + Object.keys(parameters).map(key => `${key}=${encodeURIComponent(parameters[key])}`).join('&');

// Enviar la solicitud
axios.get(requestUrl)
  .then(response => {
    console.log(response.data); // Maneja la respuesta como desees
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
  });
