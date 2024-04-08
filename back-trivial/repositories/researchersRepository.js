const WBK = require('wikibase-sdk');
const WBEdit = require('wikibase-edit');

const axios = require('axios');
const transformJSON = require('../utils/transformJSON');
const getDate = require('../utils/getDate');

const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});



/*
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
      consumer_key: '91cd54bbe219843f9951e1d539fce905',
      consumer_secret: '0736d5e5c93e13c4f57736145298e99b2b33f192',
      // Obtained when the user authorized your service
      // see https://www.mediawiki.org/wiki/OAuth/For_Developers#Authorization
      token: 'a-user-token',
      token_secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MWNkNTRiYmUyMTk4NDNmOTk1MWUxZDUzOWZjZTkwNSIsImp0aSI6IjJkNWRiYThkYmNhNDhlNzQ1MmUzNjI5YzU2ZjEwMDRlNTM1NzViYTA4NWMzYTI1ZjU3Yjc2OWI5OTI4NWZjOGQ0ZDFmYWQzNjg3N2FkZDYwIiwiaWF0IjoxNzExMTI0NDEwLjA4NzU4NywibmJmIjoxNzExMTI0NDEwLjA4NzU5MSwiZXhwIjozMzI2ODAzMzIxMC4wODYsInN1YiI6Ijc0OTc1OTc5IiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyIsImVkaXRwYWdlIiwiY3JlYXRlZWRpdG1vdmVwYWdlIiwidXBsb2FkZmlsZSIsInVwbG9hZGVkaXRtb3ZlZmlsZSIsInBhdHJvbCIsInJvbGxiYWNrIiwidmlld215d2F0Y2hsaXN0IiwiZWRpdG15d2F0Y2hsaXN0IiwicHJpdmF0ZWluZm8iLCJjaGVja3VzZXIiXX0.jgIpfgMPqFtU0_oFhl0a6KyHN0py5yz7WhFYIXBywQgP-iEqO0g8tzaM4F3B3WsQfel_aPk2ChalLYRv_oFqJ5eDOZ5u0cy7CJopipqwpwU0XmBpe603_Wou4qmH5TGlY_9etLUcGoYamHVAS0OCl7r8VbsgqXJ9zdbmFiagxkWmlztt-YXBZwHSEGu94x7jDtOCND0L8aOKsN2bSbC-bfVHoKxsVHwWkHaKYVud6yLFP2MtvDYcyRSThIzfeWRD2GOtyKs8Jk2kt_IjKdE9pZ2TQrgzY2ZyP_sqdzKbSirPeNN-PoDJ7xq5zjVseWx4YXJobSpBrAauDiiYtPKAX3mM_q_dr-AqI5C0I22zsS79q58lFBh4odlrM6i6BOpHLv8yFvZQzJB24ccbxyG3fR3_KHsDYOAmDlPqegnGbsE6_F9OdfJATltwtkxyWY9UU6NXGo4gOp38g0WABSsZo8tuMDL8p9hYugW-xs0ZOeLEQ70R-dB9r8mngKwQdztm0X4v2PvA146Q8gkLsGULp7amlwJQm0LoXDLCOAjUj9tdLgtJxZU0i23haps1XaD-BHfEEUd9DP2ziFdQyoicFSHovDbKpOIy3baU1cuGIchoIOuZK9mVla0uO_Z0a_l_zfpd-v0RItbvIihv-7BXC-PnndzfgIW0_Y5r0vWd42M'
    }
  }
};
*/

/*
const generalConfig = {
  instance: 'https://www.wikidata.org',
  credentials: {
    username: 'Natalia Fernandez Riego',
    password: 'Semellones02'
  }
}
*/

//funciona pro asi no se deberia de hacer
const generalConfig = {
  // Note that it will only work for domains on HTTPS
  instance: 'https://www.wikidata.org',
  anonymous: true
}

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
      console.error('Something went wrong while processing your request: ', error);
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
      console.error('Something went wrong while processing your request: ', error);
    }
  },


  editResearcherById: async (researcherId, property, value, referenceURL) => { 
    let claim = null;
    let date = getDate.getDate();
    try {
      console.log(wbEdit);
      //los valores no son sobre eso, es en una de prueba
      claim = wbEdit.claim.create({
        id: 'Q4115189', //id del investigador --> "researcherId"
        property: 'P2002', //propiedad (lugar de nacimiento, lugar de estudio...) --> "property"
        value: 'bulgroz', //valor de la propiedad (oviedo, ucm) --> "value"
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