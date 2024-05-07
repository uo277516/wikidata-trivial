const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');

const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const getDate = require('../utils/getDate');
const path = require('path');
const fs = require('fs');


const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});



const footballersRepository = {  

  getFootballersRelation: async (relacion) => {

    //P2048 es height (altura del futbolista)
    //P6509 es total goals
    //P413 es posicion (centrocampista etc)
    try {
      
      const filePath = path.join(__dirname, '../queries/footballersQuery.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${relacion}', relacion);


      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      //en json
      console.log(response.data);

      return transformJSON.transformJSONFootballers(response.data); //devolver datos parseados
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
    }
  },


  editFootballerById: async (footballerId, property, value, referenceURL, token, token_secret) => { 
    let claim = null;
    let date = getDate.getDate();
    const generalConfig = {
      // A Wikibase instance is required
      instance: 'https://www.wikidata.org',
    
      // The instance script path, used to find the API endpoint
      // Default: /w
      wgScriptPath: '/w',
    
      // One authorization mean is required (unless in anonymous mode, see below)
      credentials: {
    
        // OR OAuth tokens
        oauth: {
          // Obtained at registration
          // https://www.mediawiki.org/wiki/OAuth/For_Developers#Registration
          consumer_key: '9c20cd7009c1672c77c46b0e8aea2403',
          consumer_secret: 'd125be1763b2704fefec7e75e60c8d9d03e208e2',
          // Obtained when the user authorized your service
          // see https://www.mediawiki.org/wiki/OAuth/For_Developers#Authorization
          token: token,
          token_secret: token_secret
        }
      }
    };

    const wbEdit = WBEdit(generalConfig);
    try {
      
      claim = wbEdit.claim.create({
        id: footballerId, //id del futbolista --> "footballerId"
        property: property, //propiedad (altura...) --> "property"
        value: value, //valor de la propiedad (1,77...) --> "value"
        references: [
          { P854: referenceURL, P813: date }
        ]   
      });
      console.log(claim);
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
    }

    return claim;

  }

};

module.exports = footballersRepository;