const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');
const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const getDate = require('../utils/getDate');
const path = require('path');
const fs = require('fs');

/**
 * Wikibase SDK instance for interacting with the APi of WIkidata.
 * @type {object}
 */
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});


/**
 * Repository object for handling operations related to footballers in Wikidata.
 * @namespace footballersRepository
 */
const footballersRepository = {  

  /**
   * Retrieves footballers based on a specified relation using a SPARQL query.
   * @async
   * @function getFootballersRelation
   * @memberof footballersRepository
   * @param {string} relacion - The relation ID to query footballers (P2048 for height, P6509 for goals and P413 for position).
   * @returns {Promise<Array<object>|null>} Promise that resolves to an array of parsed footballer data or null if an error occurs.
   */
  getFootballersRelation: async (relacion) => {
    try {
      
      const filePath = path.join(__dirname, '../queries/footballersQuery.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${relacion}', relacion);

      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      console.log(response.data);

      return transformJSON.transformJSONFootballers(response.data); 
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
      return null;
    }
  },

  /**
   * Edits a footballer entity on Wikidata by adding a non existent property value.
   * @async
   * @function editFootballerById
   * @memberof footballersRepository
   * @param {string} footballerId - The Wikidata ID of the footballer entity.
   * @param {string} property - The property ID to edit.
   * @param {string} value - The new value for the specified property.
   * @param {string} referenceURL - The reference URL of the entity.
   * @param {string} token - OAuth token for authorization.
   * @param {string} token_secret - OAuth token secret for authorization.
   * @returns {Promise<object|null>} Promise that resolves to the edited claim object or null if an error occurs.
  */
  editFootballerById: async (footballerId, property, value, referenceURL, token, token_secret) => { 
    let claim = null;
    let date = getDate.getDate();
    const generalConfig = {
      instance: 'https://www.wikidata.org',
      wgScriptPath: '/w',
      credentials: {
        oauth: {
          consumer_key: '9c20cd7009c1672c77c46b0e8aea2403',
          consumer_secret: 'd125be1763b2704fefec7e75e60c8d9d03e208e2',
          token: token,
          token_secret: token_secret
        }
      }
    };

    const wbEdit = WBEdit(generalConfig);
    try {  
      claim = wbEdit.claim.create({
        id: footballerId, 
        property: property, 
        value: value, 
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