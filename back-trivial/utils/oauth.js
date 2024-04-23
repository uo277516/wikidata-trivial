const axios = require('axios');
const crypto = require('crypto');
const oauthSignature = require('oauth-signature');


// Construir los parámetros de la solicitud
//https://www.mediawiki.org/wiki/Special:OAuth/initiate?oauth_callback=http://localhost:3000/&oauth_consumer_key=9710c01964941c18292d69c3cd033af2
//&oauth_secret_key=7d61936d0335c9443f3a041812a25bc948ef29b8&oauth_timestamp=1713904704

const params = {
  oauth_callback: 'oob',
  oauth_consumer_key: '9710c01964941c18292d69c3cd033af2',
  oauth_consumer_secret: '7d61936d0335c9443f3a041812a25bc948ef29b8',
  oauth_timestamp: Math.floor(Date.now() / 1000),
  oauth_version: '1.0',
  oauth_nonce: generateNonce(),
  oauth_signature_method: 'HMAC-SHA1',
};

const baseString = `GET https://www.mediawiki.org/wiki/Special:OAuth/initiate?
  oauth_callback=oob&
  oauth_consumer_key=${encodeURIComponent('9710c01964941c18292d69c3cd033af2')}&
  oauth_consumer_secret=${encodeURIComponent('7d61936d0335c9443f3a041812a25bc948ef29b8')}&
  oauth_nonce=${generateNonce()}&
  oauth_signature_method=HMAC-SHA1&
  oauth_timestamp=${Math.floor(Date.now() / 1000)}
`;

console.log("patata-- " + baseString);

const encodeU = encodeURI(baseString);

console.log(encodeU);

const signingKey = `<span class="math-inline">\{9710c01964941c18292d69c3cd033af2\}&</span>{7d61936d0335c9443f3a041812a25bc948ef29b8 || ''}`;

const encodedSigningKey = encodeURIComponent(signingKey);

const signature2 = calculateHMACSHA1(encodeU, encodedSigningKey);


function calculateHMACSHA1(data, key) {
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(data);
  const signature = hmac.digest('base64');
  return signature;
}

console.log(signature2);

//Firmar la solicitud
//const signature = generateSignature('GET', 'Special:OAuth/initiate', params, '7d61936d0335c9443f3a041812a25bc948ef29b8');
//const encodedSignature = oauthSignature.generate('GET', 'https://www.mediawiki.org/wiki/Special:OAuth/initiate?', params);
const signature = generateSignature('GET', 'https://www.mediawiki.org/wiki/Special:OAuth/initiate?', params, '7d61936d0335c9443f3a041812a25bc948ef29b8');

//Agregar la firma 
//params.oauth_signature = signature;
params.oauth_signature = signature2;


console.log(signature);


function queryString(params) {
  return Object.keys(params).sort().map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
}



function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

//firma HMAC-SHA1
function generateSignature(method, url, params, consumerSecret) {
  const parameterString = queryString(params);
  const baseString = method.toUpperCase() + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(parameterString);
  const hmac = crypto.createHmac('sha1', consumerSecret);
  hmac.update(baseString);
  return hmac.digest('base64');
}


const url = 'https://www.mediawiki.org/wiki/Special:OAuth/initiate?' + queryString(params);

//nviar la solicitud
console.log(url);

axios.get(url)
  .then(response => {
    console.log(response.data); // La respuesta debe contener el token de solicitud y el secreto de solicitud
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
  });
