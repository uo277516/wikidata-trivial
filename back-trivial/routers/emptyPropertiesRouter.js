const express = require("express");
const emptyPropertiesController = require('../controllers/emptyPropertiesController');

const emptyPropertiesRouter = express.Router();

//lista de la relaciones
emptyPropertiesRouter.get("/:entity/:relations", emptyPropertiesController.getEmptyProperties);



module.exports = emptyPropertiesRouter;