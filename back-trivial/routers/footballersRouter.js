const express = require("express");
const footballersController = require('../controllers/footballersController');

const footballersRouter = express.Router();



//editar, supongo q tendra q ser un post o algo despues
footballersRouter.post("/", footballersController.editFootballerById);

//P2048 altura
footballersRouter.get("/:relacion", footballersController.getFootballersRelation);



module.exports = footballersRouter;