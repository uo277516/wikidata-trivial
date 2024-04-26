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
      const { question, entity, relation } = questions[randomNumber];

      return { question, entity, relation };
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
  const relations = ["/P19", "/P69"];   //nacer, estudiar
  const messages = ['Dónde nació el investigador', 'Dónde estudió el investigador'];
  return createQuestions(relations, messages, "researchers", 'investigador', 'investigadorLabel');
};


const fetchQuestionsFootballers = async () => {
  const relations = ["/P2048", "/P6509", "/P413"]; //altura, goles, posicion
  const messages = ['Cuál es la altura en centímetros del futbolista', 'Cuántos goles ha marcado a lo largo de su carrera el futbolista', 'Cuál es una de las posiciones principales en las que suele desempeñarse en el campo de juego el futbolista'];
  return createQuestions(relations, messages, "footballers", 'futbolista', 'futbolistaLabel');
};



export { fetchQuestionsFootballers, fetchQuestionsResearchers };
