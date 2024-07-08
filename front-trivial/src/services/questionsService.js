import { WBK } from 'wikibase-sdk'
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

/**
 * Array of relations specific to researchers. Born and Study
 * @constant {string[]}
 */
const researcherRelations = ["/P19", "/P69"];   

/**
 * Array of relations specific to footballers. Height, goals and position
 * @constant {string[]}
 */
const footballerRelations = ["/P2048", "/P6509", "/P413"]; 

/**
 * Array of relations specific to groups. Date of fundation and discography
 * @constant {string[]}
 */
const groupRelations = ["/P571", "/P264"]; 




/**
 * Edits an entity based on category, property, value, and reference URL.
 * @async
 * @function editEntity
 * @param {string} selCategory - Selected category (deporte, investigación, música).
 * @param {string} footballerId - ID of the footballer entity.
 * @param {string} property - Property to edit.
 * @param {any} value - New value for the property.
 * @param {string} referenceURL - URL reference for the edit.
 * @param {string} token - OAuth token for authentication.
 * @param {string} token_secret - OAuth token secret for authentication.
 * @returns {Promise<any>} Result of the edit operation.
 */
const editEntity = async (selCategory, footballerId, property, value, referenceURL, token, token_secret) => {
  let endpoint=null;
  if (selCategory==="deporte") {
    endpoint='footballers';
  } else if (selCategory==="investigación") {
    endpoint='researchers';
  } else if (selCategory==="música") {
    endpoint='footballers';
  }
  try {
    const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/" + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ footballerId, property, value, referenceURL, token, token_secret })
    });

    if (!response.ok) {
      throw new Error('Failed to edit entity');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error editing entity:', error);
    throw error;
  }
};


/**
 * Fetches data from a specific entity endpoint.
 * @async
 * @function fetchData
 * @param {string} entity - Entity name.
 * @param {string} endpoint - Endpoint to fetch from.
 * @returns {Promise<Object[]>} Array of fetched data bindings.
 */
const fetchData = async (entity, endpoint) => {
  try {
    const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/" + entity + endpoint);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData.results.bindings;
    } else {
      console.error("Error fetching data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


/**
 * Fetches empty properties of an entity based on specified relations.
 * @async
 * @function fetchProperties
 * @param {string} entity - Entity name.
 * @param {string[]} relations - Array of relations to fetch.
 * @returns {Promise<Object>} JSON object containing fetched properties.
 */
const fetchProperties = async (entity, relations) => {
  let list="";
  relations.forEach(relation => {
    list += "wdt:" + relation.slice(1) + " ";
  });
  list=list.trim();
  const encodedList = encodeURIComponent(list);
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/properties/wd:${entity}/${encodedList}`);
    console.log(response);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      console.error("Error fetching data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


/**
 * Checks properties of an entity based on its category.
 * @async
 * @function checkProperties
 * @param {string} entity - Entity name.
 * @param {string} category - Category name (investigación, deporte, música).
 * @returns {Promise<string[] | null>} Array of false properties or null if error.
 */
const checkProperties = async (entity, category, relArray) => {
  let relations=null;
  if (category==="investigación") {
     relations = researcherRelations;
  } else if (category==="deporte") {
     relations = footballerRelations;
  } else {
     relations = groupRelations;
  }


  // const propertiesJSON = await fetchProperties(entity, relations);
  // if (!propertiesJSON) {
  //   return null;
  // } else {
  //   const lista = JSON.parse(propertiesJSON);
  //   const propiedadesFalsas = [];
  //   lista.forEach(objeto => {
  //     for (const propiedad in objeto) {
  //       for (const rel in relArray) {
  //         if (objeto[propiedad] === false && propiedad !== rel.split("/")[1]) {
  //           propiedadesFalsas.push(`/${propiedad}`);
  //         }
  //       }
  //     }
  //   });

  //   return propiedadesFalsas;
  // }

  const propiedadesFalsas = [];
  for (const relation of relations) {
    if (!relArray.includes(relation)) {
      propiedadesFalsas.push(relation);
    }
  }
  console.log(propiedadesFalsas);
  return propiedadesFalsas;
  
};



/**
 * Generates questions based on fetched data, entity, label, and relation.
 * @function generateQuestions
 * @param {Object[]} data - Fetched data.
 * @param {string} labelPrefix - Prefix for question label.
 * @param {string} entityProperty - Property of the entity.
 * @param {string} labelProperty - Property label.
 * @param {string} relation - Relation string.
 * @returns {Object[]} Array of generated questions.
 */
const generateQuestions = (data, labelPrefix, entityProperty, labelProperty, relation) => {
  if (!data) return [];
  
  return data.map((item) => ({
    question: `¿${labelPrefix} ${item[labelProperty]}?`,
    entity: item[entityProperty],
    relation,
    imagenUrl: item.imagenUrl,
    labelEntity: item[labelProperty]
  }));
};

/**
 * Creates random questions based on relations, messages, and entity details.
 * @async
 * @function createQuestions
 * @param {string[]} relations - Array of relations to choose from.
 * @param {string[]} messages - Array of messages for each relation.
 * @param {string} entitiesName - Name of the entity.
 * @param {string} jsonName - JSON property name.
 * @param {string} jsonLabel - JSON label property.
 * @returns {Promise<Object>} Randomly selected question details.
 */
const createQuestions = async (relations, messages, entitiesName, jsonName, jsonLabel) => {
  try {
    const random = Math.floor(Math.random() * relations.length); 
    const relationChosed = relations[random];
    const questionMsg = messages[random];

    const data = await fetchData(entitiesName, relationChosed);

    if (data) {
      const questions = generateQuestions(data, questionMsg, jsonName, jsonLabel, relationChosed);
      const randomNumber = Math.floor(Math.random() * questions.length);
      const { question, entity, relation, imagenUrl, labelEntity } = questions[randomNumber];
      
      return { question, entity, relation, imagenUrl, labelEntity };
    } else {
      throw new Error("Error fetching "+entitiesName+" data");
    }
  } catch (error) {
    console.error("Error fetching "+entitiesName+" questions:", error);
    throw error;
  }

};



/**
 * Fetches questions related to researchers.
 * @async
 * @function fetchQuestionsResearchers
 * @returns {Promise<Object>} Randomly selected question details.
 */
const fetchQuestionsResearchers = async () => {
  const messages = ["En qué ciudad nació el/la investigador/a", "En qué universidad estudió el/la investigador/a"];
  return createQuestions(researcherRelations, messages, "researchers", 'investigador', 'investigadorLabel');
};

/**
 * Fetches questions related to footballers.
 * @async
 * @function fetchQuestionsFootballers
 * @returns {Promise<Object>} Randomly selected question details.
 */
const fetchQuestionsFootballers = async () => {
  const messages = ["Cuál es la altura en centímetros de la/el futbolista", "Cuántos goles ha marcado a lo largo de su carrera el futbolista", "Cuál es una de las posiciones principales en las que suele desempeñarse en el campo de juego el futbolista"];
  return createQuestions(footballerRelations, messages, "footballers", 'futbolista', 'futbolistaLabel');
};

/**
 * Fetches questions related to groups.
 * @async
 * @function fetchQuestionsGroups
 * @returns {Promise<Object>} Randomly selected question details.
 */
const fetchQuestionsGroups = async () => {
  const messages = ["Cuál es el año en el que se fundó el grupo", "Cuál es el sello discográfico (o uno de ellos) del grupo"];
  return createQuestions(groupRelations, messages, "groups", 'grupo', 'grupoLabel');
};


/**
 * Search entites for a value
 * @async
 * @function searchEntityForValue
 * @returns {Promise<Object>} 
 */
const searchEntityForValue = async (value, entities) => {
  //search entities for the value
  const urlSearch = wdk.searchEntities({
      search: value,
      language: 'es',  
      limit: 8  
  });
  const searchResults = await fetch(urlSearch).then(res => res.json());
  //for the results, i get the ID
  for (let result of searchResults.search) {
      const entityId = result.id;
      //obtein details of the entity
      const url = wdk.getEntities({
          ids: entityId,
          language: ['es']  
      });
      const entitiesDetails  = await fetch(url).then(res => res.json());
      const key = Object.keys(entitiesDetails.entities)[0];
      const entityClaims = entitiesDetails.entities[key].claims;
      if (entityClaims && entityClaims['P31']) {
        for (let entityClaim of entityClaims['P31']) {
          const id = entityClaim.mainsnak.datavalue.value.id;
          for (let entity of entities) {
            if (entity===id) {
              return entityId;
            }
          }
        }
      }
  }
  return null;
}


/**
 * Get entity for a value
 * @async
 * @function getEntityForValue
 * @returns {any[]} 
 */
const getEntityForValue = (relation) => {
  if (footballerRelations.includes(relation)) { //it is footballer 
    if (relation===footballerRelations[2]) { //position 
      return ["Q4611891"];
    } 
  } else if (groupRelations.includes(relation)) {
    if (relation===groupRelations[1]) {
      return ["Q2442401", "Q1660312", "Q116453729", "Q18127"];
    }
  } else if (researcherRelations.includes(relation)) {
    if (relation===researcherRelations[0]) {
      return ["Q515"];
    } else {
      return ["Q875538"];
    }
  }
  return null; //it doesnt need any of that
};

export { fetchQuestionsFootballers, fetchQuestionsResearchers , fetchQuestionsGroups, editEntity, checkProperties, getEntityForValue, searchEntityForValue};
