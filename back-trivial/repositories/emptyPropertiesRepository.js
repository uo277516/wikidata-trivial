const WBK = require('wikibase-sdk');
const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const path = require('path');
const fs = require('fs');

/**
 * Wikibase SDK instance for interacting with the API of Wikidata.
 * @type {object}
 */
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});


/**
 * Repository object for handling operations related to empty properties in Wikidata.
 * @namespace emptyPropertiesRepository
 */
const emptyPropertiesRepository = {  

  /**
   * Retrieves empty properties for a specified entity and relations using a SPARQL query.
   * @async
   * @function getEmptyProperties
   * @memberof emptyPropertiesRepository
   * @param {string} entity - The Wikidata entity ID.
   * @param {string[]} relations - Array of relation IDs.
   * @returns {Promise<Array<object>|null>} Promise that resolves to an array of parsed properties or null if an error occurs.
   */
  getEmptyProperties: async (entity, relations) => {

    try {
      
      const filePath = path.join(__dirname, '../queries/searchEmptyProperties.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${entity}', entity);
      sparqlQuery = sparqlQuery.replace('${relations}', relations);

      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      console.log(response.data);

      return transformJSON.transformJSONProperties(response.data); 
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
      return null;
    }
  }

};

module.exports = emptyPropertiesRepository;