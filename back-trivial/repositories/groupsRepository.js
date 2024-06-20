const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');
const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const getDate = require('../utils/getDate');
const path = require('path');
const fs = require('fs');

/**
 * Wikibase SDK instance for interacting with the WIkidata API.
 * @type {object}
 */
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

/**
 * Repository object for handling operations related to groups in Wikidata.
 * @namespace groupsRepository
 */
const groupsRepository = {  

  /**
   * Retrieves groups based on a specified relation using a SPARQL query.
   * @async
   * @function getGroupsRelation
   * @memberof groupsRepository
   * @param {string} relacion - The relation ID to query groups.
   * @returns {Promise<Array<object>|null>} Promise that resolves to an array of parsed group data or null if an error occurs.
   */
  getGroupsRelation: async (relacion) => {

    try {
      
      const filePath = path.join(__dirname, '../queries/groupsQuery.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${relacion}', relacion);

      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      console.log(response.data);

      return transformJSON.transformJSONGroups(response.data); 
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
      return null;
    }
  },

  /**
   * Edits a group entity on Wikidata by adding or updating a specific property value.
   * @async
   * @function editGroupById
   * @memberof groupsRepository
   * @param {string} groupId - The Wikidata ID of the group entity.
   * @param {string} property - The property ID to edit.
   * @param {string} value - The new value for the specified property.
   * @param {string} referenceURL - The reference URL of the information of the entity.
   * @param {string} token - OAuth token for authorization.
   * @param {string} token_secret - OAuth token secret for authorization.
   * @returns {Promise<object|null>} Promise that resolves to the edited claim object or null if an error occurs.
   */
  editGroupById: async (groupId, property, value, referenceURL, token, token_secret) => { 
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
        id: groupId, 
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

module.exports = groupsRepository;
