const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

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

const requestBody = oauth.authorize(request_data);

console.log(requestBody);

axios({
  url: request_data.url,
  method: request_data.method,
  data: requestBody 
})
  .then(response => {
    console.log(response.data); 
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
  });
