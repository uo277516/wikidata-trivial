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

//preguntas futbolistas
const fetchQuestionsFootballers = async () => {
  try {
    const footballersDataHeight = await fetchData("footballers", "/P2048");

    console.log(footballersDataHeight);

    if (footballersDataHeight) {
      const heightQuestions = footballersDataHeight.map((item) => `¿Cuál es la altura en centímetros del futbolista ${item.futbolistaLabel}?`);

      const randomNumber = Math.floor(Math.random() * heightQuestions.length + 1);
      const question = heightQuestions[randomNumber];

      console.log("pregunta en service de futbolista-> " + question);
      return question;
    } else {
      throw new Error("Error fetching footballers data");
      //notification.error({message: 'Error al cargar preguntas.', description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.', placement: 'top'});
    }
  } catch (error) {
    console.error("Error fetching footballers questions:", error);
    throw error;
  }
};

const fetchQuestionsResearchers = async () => {
  try {
    const investigatorDataBorn = await fetchData("researchers", "/P19");
    const investigatorDataStudy = await fetchData("researchers", "/P69");

    if (investigatorDataBorn && investigatorDataStudy) {
      const bornQuestions = investigatorDataBorn.map((item) => `¿Dónde nació el investigador ${item.investigadorLabel}?`);
      const studyQuestions = investigatorDataStudy.map((item) => `¿Dónde estudió el investigador ${item.investigadorLabel}?`);

      const questionsArray = [...bornQuestions, ...studyQuestions];
      const randomNumber = Math.floor(Math.random() * questionsArray.length + 1);
      const question = questionsArray[randomNumber];

      console.log("pregunta en service de investigador-> " + question);
      //console.log(questionSelected); como no renderiza justo esto devuelve el anterior pero va bien en la realidad
      return question;
    } else {
      throw new Error("Error fetching researchers data");
      //notification.error({message: 'Error al cargar preguntas.', description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.', placement: 'top'});
    }
  } catch (error) {
    console.error("Error fetching researchers questions:", error);
    throw error;
  }
};

export { fetchQuestionsFootballers, fetchQuestionsResearchers };
