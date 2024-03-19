const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');

const axios = require('axios');
const transformJSON = require('../utils/transformJSON');

const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});



const generalConfig = {
  // A Wikibase instance is required
  instance: 'https://www.wikidata.org',

  // The instance script path, used to find the API endpoint
  // Default: /w
  wgScriptPath: '/w',

  // One authorization mean is required (unless in anonymous mode, see below)
  credentials: {
    // either a username and password
    username: 'my-wikidata-username',
    // Optional: generate a dedicated password with tailored rights on /wiki/Special:BotPasswords
    // See the 'Credentials' paragraph below
    password: 'my-wikidata-password',

    // OR OAuth tokens
    oauth: {
      // Obtained at registration
      // https://www.mediawiki.org/wiki/OAuth/For_Developers#Registration
      consumer_key: 'your-consumer-token',
      consumer_secret: 'your-secret-token',
      // Obtained when the user authorized your service
      // see https://www.mediawiki.org/wiki/OAuth/For_Developers#Authorization
      token: 'a-user-token',
      token_secret: 'a-secret-token'
    }
  }
};

const wbEdit = WBEdit(generalConfig)






const researchersRepository = {
  getResearchers: async () => {

    try {
      // const sparql = `
      // SELECT ?item ?itemLabel
      // WHERE
      // {
      //   ?item wdt:P31 wd:Q146. 
      //   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
      // }
      // `;

      const sparql = `
      SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:P69 ?lugarEstudiar. }  
      FILTER (!BOUND(?lugarEstudiar))  
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
      `;
      const url = wdk.sparqlQuery(sparql);

      const response = await axios.get(url); 

      //en json
      console.log(response.data);

      return transformJSON.transformJSON(response.data); //devolver datos parseados
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  }
  ,
  getResearchersRelation: async (relacion) => {

    try {
      //consulta de los gatos ara ver q va bien
      // const sparql = `
      // SELECT ?item ?itemLabel
      // WHERE
      // {
      //   ?item wdt:P31 wd:Q146. 
      //   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
      // }
      // `;
      const sparql = `
      SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:${relacion} ?lugar. }  
      FILTER (!BOUND(?lugar))  
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
      `;
      const url = wdk.sparqlQuery(sparql);

      const response = await axios.get(url); 

      //en json
      console.log(response.data);

      return transformJSON.transformJSON(response.data); //devolver datos parseados
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  }
};

module.exports = researchersRepository;