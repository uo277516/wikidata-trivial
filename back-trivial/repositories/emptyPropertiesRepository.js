const WBK = require('wikibase-sdk');

const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const path = require('path');
const fs = require('fs');


const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});



const emptyPropertiesRepository = {  

  getEmptyProperties: async (entity, relations) => {

    try {
      
      const filePath = path.join(__dirname, '../queries/searchEmptyProperties.rq');
      let sparqlQuery = fs.readFileSync(filePath, 'utf-8');
      sparqlQuery = sparqlQuery.replace('${entity}', entity);
      sparqlQuery = sparqlQuery.replace('${relations}', relations);



      const url = wdk.sparqlQuery(sparqlQuery);
      const response = await axios.get(url);  

      //en json
      console.log(response.data);

      return transformJSON.transformJSONProperties(response.data); //devolver datos parseados
    } catch (error) {
      console.error('Something went wrong while processing your request: ', error);
      return null;
    }
  }

};

module.exports = emptyPropertiesRepository;