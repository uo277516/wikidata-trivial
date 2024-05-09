const express = require("express");
const footballersController = require('../controllers/footballersController');

const footballersRouter = express.Router();



footballersRouter.post("/", footballersController.editFootballerById);

//P2048 altura
//P413 posicion solo jugadores de futbol
//P6509 goles totales en carrera
footballersRouter.get("/:relacion", footballersController.getFootballersRelation);



module.exports = footballersRouter;