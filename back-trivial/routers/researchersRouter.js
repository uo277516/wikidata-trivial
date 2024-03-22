const express = require("express");
const researchersController = require('../controllers/researchersController');

const researchersRouter = express.Router();

//este posiblemente lo quite
researchersRouter.get("/", researchersController.getResearchers);

//P69 es no sitio donde estudiar
//P19 es no sitio de lugar de nacimiento
researchersRouter.get("/:relacion", researchersController.getResearchersRelation);

//editar
researchersRouter.get("/editar", researchersController.editResearcherById);

module.exports = researchersRouter