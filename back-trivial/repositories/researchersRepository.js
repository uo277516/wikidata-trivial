const WBK = require('wikibase-sdk');
const axios = require('axios');
const transformJSON = require('../utils/transformJSON');


const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

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