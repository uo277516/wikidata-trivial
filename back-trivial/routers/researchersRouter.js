const express = require("express");
const researchersController = require('../controllers/researchersController');

const researchersRouter = express.Router();

//este posiblemente lo quite
researchersRouter.get("/", researchersController.getResearchers);


//editar, supongo q tendra q ser un post o algo despues
researchersRouter.post("/", researchersController.editResearcherById);

//P69 es no sitio donde estudiar
//P19 es no sitio de lugar de nacimiento
researchersRouter.get("/:relacion", researchersController.getResearchersRelation);



module.exports = researchersRouter