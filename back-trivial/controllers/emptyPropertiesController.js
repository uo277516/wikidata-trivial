const emptyPropertiesService = require('../services/emptyPropertiesService');

/**
 * Controller for handling requests related to empty properties.
 * @namespace emptyPropertiesController
 */
emptyPropertiesController = {


    /**
     * Retrieves empty properties for a given entity and its relations.
     * @async
     * @function getEmptyProperties
     * @memberof emptyPropertiesController
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the process.
     */
    getEmptyProperties: async (req, res) => {
        try {
            let entity = req.params.entity;
            let relations = req.params.relations;
            let properties = await emptyPropertiesService.getEmptyProperties(entity, relations);
            setTimeout(() => {
                res.json(properties)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = emptyPropertiesController;