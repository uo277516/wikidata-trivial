const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');
const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const getDate = require('../utils/getDate');
const path = require('path');
const fs = require('fs');

/**
 * Wikibase SDK instance for interacting with the API fo Wikidata.
 * @type {object}
 */
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});


//anonymous way to do it
/*const generalConfig = {
  // Note that it will only work for domains on HTTPS
  instance: 'https://www.wikidata.org',
  anonymous: true
}*/

/**
 * Repository object for handling operations related to researchers in Wikidata.
 * @namespace researchersRepository
 */
const researchersRepository = {  
  
  /**
   * Retrieves researchers from Wikidata using a predefined SPARQL query.
   * @async
   * @function getResearchers
   * @memberof researchersRepository
   * @returns {Promise<Array<object>|undefined>} Promise that resolves to an array of parsed researcher data or undefined if an error occurs.
   */
  getResearchers: async () => {

    try {
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

      console.log(response.data);

      return transformJSON.transformJSONResearchers(response.data); 
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
    }
  },

  /**
   * Retrieves researchers based on a specified relation using a SPARQL query.
   * @async
   * @function getResearchersRelation
   * @memberof researchersRepository
   * @param {string} relacion - The relation ID to query researchers.
   * @returns {Promise<Array<object>|null>} Promise that resolves to an array of parsed researcher data or null if an error occurs.
   */
  getResearchersRelation: async (relacion) => {

    try {
      const filePath = path.join(__dirname, '../queries/researchersQuery.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${relacion}', relacion);


      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      console.log(response.data);

      return transformJSON.transformJSONResearchers(response.data);
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
      return null;
    }
  },

  /**
   * Edits a researcher entity on Wikidata by adding a non existing property value.
   * @async
   * @function editResearcherById
   * @memberof researchersRepository
   * @param {string} researcherId - The Wikidata ID of the researcher entity.
   * @param {string} property - The property ID to edit.
   * @param {string} value - The new value for the specified property.
   * @param {string} referenceURL - The reference URL for the edit.
   * @param {string} token - OAuth token for authorization.
   * @param {string} token_secret - OAuth token secret for authorization.
   * @returns {Promise<object|null>} Promise that resolves to the edited claim object or null if an error occurs.
   */
  editResearcherById: async (researcherId, property, value, referenceURL, token, token_secret) => { 
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
        id: researcherId, 
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

module.exports = researchersRepository;