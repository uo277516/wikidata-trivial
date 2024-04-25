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
      //aqui algo para que salga pantalla? lo de abajo no está probado
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

//formar entidad de devolver con la pregunta la entidad y la relacion para poder mandar la edicion en front
const generateQuestions = (data, labelPrefix, entityProperty, labelProperty, relation) => {
  if (!data) return [];
  
  return data.map((item) => ({
    question: `¿${labelPrefix} ${item[labelProperty]}?`,
    entity: item[entityProperty],
    relation
  }));
};

const createQuestions = (relations, messages, entitiesName, jsonName, jsonLabel) => {
  

};

//preguntas investigadores
const fetchQuestionsResearchers = async () => {
  try {
    //P19 es nacer
    //P69 es estudiar
    const relations = ["/P19", "/P69"];
    const messages = ['Dónde nació el investigador', 'Dónde estudió el investigador'];
    const random = Math.floor(Math.random() * relations.length); 
    const relationChosed = relations[random];
    const questionMsg = messages[random];

    const researcherData = await fetchData("researchers", relationChosed);

    if (researcherData) {
      const questions = generateQuestions(researcherData, questionMsg, 'investigador', 'investigadorLabel', relationChosed);
      const randomNumber = Math.floor(Math.random() * questions.length);
      const { question, entity, relation } = questions[randomNumber];

      return { question, entity, relation };
    } else {
      throw new Error("Error fetching researchers data");
    }
  } catch (error) {
    console.error("Error fetching researchers questions:", error);
    throw error;
  }
};


const fetchQuestionsFootballers = async () => {
  try {
    //P2048 altura
    //P6509 goles
    //P413 posicion
    const relations = ["/P2048", "/P6509", "/P413"];
    const messages = ['Cuál es la altura en centímetros del futbolista', 'Cuántos goles ha marcado a lo largo de su carrera el futbolista', 'Cuál es una de las posiciones principales en las que suele desempeñarse en el campo de juego el futbolista'];
    const random = Math.floor(Math.random() * relations.length); // Genera números aleatorios en el rango 0-2
    const relationChosed = relations[random];
    const questionMsg=messages[random];

    const footballersData = await fetchData("footballers", relationChosed); 

    if (footballersData) {
      const questions = generateQuestions(footballersData, questionMsg, 'futbolista', 'futbolistaLabel', relationChosed);
      const randomNumber = Math.floor(Math.random() * questions.length);
      const { question, entity, relation } = questions[randomNumber];

      return { question, entity, relation };
    } else {
      throw new Error("Error fetching footballers data");
    }
  } catch (error) {
    console.error("Error fetching footballers questions:", error);
    throw error;
  }
};



export { fetchQuestionsFootballers, fetchQuestionsResearchers };
