const express = require("express");
const groupsController = require('../controllers/groupsController');
const groupsRouter = express.Router();

/**
 * Route to edit a group ID.
 * POST /
 * @name EditGroupById
 * @function
 * @memberof groupsRouter
 * @param {object} req - The request object containing group details.
 * @param {object} res - The response object to send back the result.
 * @returns {object} - JSON object containing the result of the edit operation.
 * @throws {object} - JSON object containing errors if any occur.
*/
groupsRouter.post("/", groupsController.editGroupById);

/**
 * Route to get groups based on a relation.
 * GET /:relacion
 * @name GetGroupsRelation
 * @function
 * @memberof groupsRouter
 * @param {string} :relacion - The relation associated with the groups.
 * @returns {object} - JSON object containing groups related to the specified relation.
 * @throws {object} - JSON object containing errors if any occur.
*/
groupsRouter.get("/:relacion", groupsController.getGroupsRelation);

module.exports = groupsRouter;
