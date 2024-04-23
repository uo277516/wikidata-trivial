// Dependencies
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// Initialize
const oauth = OAuth({
    consumer: {
        key: '9710c01964941c18292d69c3cd033af2',
        secret: '7d61936d0335c9443f3a041812a25bc948ef29b8',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
    },
});

const request_data = {
    url: 'https://www.mediawiki.org/wiki/Special:OAuth/initiate?',
    method: 'GET',
    data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
};

// Construir el cuerpo de la solicitud
const requestBody = oauth.authorize(request_data);

console.log(requestBody);

// Realizar la solicitud utilizando Axios
axios({
  url: request_data.url,
  method: request_data.method,
  data: requestBody // Usamos 'data' en lugar de 'form' para enviar el cuerpo de la solicitud
})
  .then(response => {
    console.log(response.data); // Imprimir la respuesta
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
  });
