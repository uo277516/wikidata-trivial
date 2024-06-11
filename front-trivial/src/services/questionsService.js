const researcherRelations = ["/P19", "/P69"];   //nacer, estudiar
const footballerRelations = ["/P2048", "/P6509", "/P413"]; //altura, goles, posicion
const groupRelations = ["/P571", "/P264"]; //fecha de fundacion (año)

const editEntity = async (selCategory, footballerId, property, value, referenceURL, token, token_secret) => {
  let endpoint=null;
  if (selCategory==="futbolistas") {
    endpoint='footballers';
  } else if (selCategory==="investigadores") {
    endpoint='researchers';
  } else if (selCategory==="raperos") {
    endpoint='rappers';
  }
  console.log(endpoint);
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



const fetchData = async (entity, endpoint) => {
  try {
    const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/" + entity + endpoint);
    //provocar error 500 para mirar que va
    //const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "d/reseasrchers" + endpoint);
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
      console.log(json);
      return json;
    } else {
      console.error("Error fetching data:", response.statusText);
      //aqui algo para que salga pantalla? lo de abajo no está probado
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const checkProperties = async (entity, category) => {

  let relations=null;
  if (category==="investigación") {
     relations = researcherRelations;
  } else if (category==="deporte") {
     relations = footballerRelations;
  } else {
     relations = groupRelations;
  }


  const propertiesJSON = await fetchProperties(entity, relations);
  console.log(propertiesJSON);
  if (!propertiesJSON) {
    return null;
  } else {
    console.log("si hay"+propertiesJSON);
    const lista = JSON.parse(propertiesJSON);
    const propiedadesFalsas = [];
    lista.forEach(objeto => {
      for (const propiedad in objeto) {
        if (objeto[propiedad] === false) {
          propiedadesFalsas.push(`/${propiedad}`);
        }
      }
    });

    return propiedadesFalsas;
  }
};



//formar entidad de devolver con la pregunta la entidad y la relacion para poder mandar la edicion en front
const generateQuestions = (data, labelPrefix, entityProperty, labelProperty, relation) => {
  if (!data) return [];

  console.log(data);
  
  return data.map((item) => ({
    question: `¿${labelPrefix} ${item[labelProperty]}?`,
    entity: item[entityProperty],
    relation,
    imagenUrl: item.imagenUrl,
    labelEntity: item[labelProperty]
  }));
};

//metodo general para crear las preguntas pasando los parmetros
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



//preguntas investigadores
const fetchQuestionsResearchers = async () => {
  const messages = ["Dónde nació el/la investigador/a", "Dónde estudió el/la investigador/a"];
  return createQuestions(researcherRelations, messages, "researchers", 'investigador', 'investigadorLabel');
};


const fetchQuestionsFootballers = async () => {
  const messages = ["Cuál es la altura en centímetros de la/el futbolista", "Cuántos goles ha marcado a lo largo de su carrera el futbolista", "Cuál es una de las posiciones principales en las que suele desempeñarse en el campo de juego el futbolista"];
  return createQuestions(footballerRelations, messages, "footballers", 'futbolista', 'futbolistaLabel');
};

const fetchQuestionsGroups = async () => {
  const messages = ["Cuál es el año en el que se fundó el grupo", "Cuál es el sello discográfico (o uno de ellos) del grupo"];
  return createQuestions(groupRelations, messages, "groups", 'grupo', 'grupoLabel');
};




export { fetchQuestionsFootballers, fetchQuestionsResearchers , fetchQuestionsGroups, editEntity, checkProperties};
