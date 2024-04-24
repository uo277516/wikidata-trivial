

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


//preguntas futbolistas
const fetchQuestionsResearchers = async () => {
  try {

    const investigatorDataBorn = await fetchData("researchers", "/P19");
    const investigatorDataStudy = await fetchData("researchers", "/P69");

    if (investigatorDataBorn && investigatorDataStudy) {
      const bornQuestions = generateQuestions(investigatorDataBorn, 'Dónde nació el investigador', 'investigador', 'investigadorLabel', '/P19');
      const studyQuestions = generateQuestions(investigatorDataStudy, 'Dónde estudió el investigador', 'investigador', 'investigadorLabel', '/P69');


      const questionsArray = [...bornQuestions, ...studyQuestions];
      const randomNumber = Math.floor(Math.random() * questionsArray.length);
      const { question, entity, relation } = questionsArray[randomNumber];

      console.log(question, entity, relation);
      console.log("pregunta en service de investigador-> " + question);
      
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

    const footballersDataHeight = await fetchData("footballers", "/P2048");



    if (footballersDataHeight) {
      const heightQuestions = generateQuestions(footballersDataHeight, '¿Cuál es la altura en centímetros del futbolista', 'futbolista', 'futbolistaLabel', '/P2048');

      const randomNumber = Math.floor(Math.random() * heightQuestions.length);
      const { question, entity, relation } = heightQuestions[randomNumber];

      console.log("pregunta en service de futbolista-> " + question);
      
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
