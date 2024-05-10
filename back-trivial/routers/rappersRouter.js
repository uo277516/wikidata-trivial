const express = require("express");
const rappersController = require('../controllers/rappersController');

const rappersRouter = express.Router();



rappersRouter.post("/", rappersController.editRapperById);

rappersRouter.get("/:relacion", rappersController.getRappersRelation);



module.exports = rappersRouter;