const express = require("express");
const emptyPropertiesController = require('../controllers/emptyPropertiesController');

const emptyPropertiesRouter = express.Router();

/**
 * Route to retrieve empty properties for a specified entity and relations.
 * GET /:entity/:relations
 * @name GET_empty_properties
 * @function
 * @memberof emptyPropertiesRouter
 * @param {string} :entity - The entity for which empty properties are to be retrieved.
 * @param {string} :relations - The relations associated with the entity.
 * @returns {object} - JSON object containing the empty properties.
 * @throws {object} - JSON object containing errors if any occur.
 */
emptyPropertiesRouter.get("/:entity/:relations", emptyPropertiesController.getEmptyProperties);


module.exports = emptyPropertiesRouter;