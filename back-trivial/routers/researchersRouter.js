const express = require("express");
const researchersController = require('../controllers/researchersController');

const researchersRouter = express.Router();

/**
 * Route to get a list of researchers.
 * GET /
 * @name GetResearchers
 * @function
 * @memberof researchersRouter
 * @param {object} res - The response object to send back the researchers list.
 * @returns {object} - JSON object containing a list of researchers.
 * @throws {object} - JSON object containing errors if any occur.
*/
researchersRouter.get("/", researchersController.getResearchers);


/**
 * Route to edit a researcher's details by ID.
 * POST /
 * @name EditResearcherById
 * @function
 * @memberof researchersRouter
 * @param {object} req - The request object containing researcher details.
 * @param {object} res - The response object to send back the result.
 * @returns {object} - JSON object containing the result of the edit operation.
 * @throws {object} - JSON object containing errors if any occur.
*/
researchersRouter.post("/", researchersController.editResearcherById);


/**
 * Route to get researchers based on a relation.
 * GET /:relacion
 * @name GetResearchersRelation
 * @function
 * @memberof researchersRouter
 * @param {string} :relacion - The relation associated with the researchers. P69 place of stufy, P19 place of birth.
 * @returns {object} - JSON object containing researchers related to the specified relation.
 * @throws {object} - JSON object containing errors if any occur.
*/
researchersRouter.get("/:relacion", researchersController.getResearchersRelation);



module.exports = researchersRouter