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

const groupsRepository = {  

  getGroupsRelation: async (relacion) => {

    //PP569 fecha de nacimiento
    try {
      
      const filePath = path.join(__dirname, '../queries/groupsQuery.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${relacion}', relacion);

      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      //en json
      console.log(response.data);

      return transformJSON.transformJSONGroups(response.data); //devolver datos parseados
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
    }
  },

  editGroupById: async (groupId, property, value, referenceURL, token, token_secret) => { 
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
        id: groupId, //id del grupo --> "groupId"
        property: property, //propiedad (fecha de fundación...) --> "property"
        value: value, //valor de la propiedad (10/10/2010...) --> "value"
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

module.exports = groupsRepository;
