const express = require("express");
const footballersController = require('../controllers/footballersController');

const footballersRouter = express.Router();

/**
 * Route to edit a footballer's details by ID.
 * POST /
 * @name EditFootballerById
 * @function
 * @memberof footballersRouter
 * @param {object} req - The request object containing footballer details.
 * @param {object} res - The response object to send back the result.
 * @returns {object} - JSON object containing the result of the edit operation.
 * @throws {object} - JSON object containing errors if any occur.
 */
footballersRouter.post("/", footballersController.editFootballerById);


/**
 * Route to get footballers based on a relation.
 * GET /:relacion
 * @name GetFootballersRelation
 * @function
 * @memberof footballersRouter
 * @param {string} :relacion - The relation associated with the footballers. P2048 height, P413 goals and P6509 goals
 * @returns {object} - JSON object containing footballers related to the specified relation.
 * @throws {object} - JSON object containing errors if any occur.
 */
footballersRouter.get("/:relacion", footballersController.getFootballersRelation);



module.exports = footballersRouter;