const footballersService = require('../services/footballersService');

/**
 * Controller for handling footballer-related requests.
 * @namespace footballersController
 */
footballersController = {

    /**
     * Edits a footballer's information by ID (Q entity of Wikidata).
     * @async
     * @function editFootballerById
     * @memberof footballersController
     * @param {Object} req - The request object.
     * @param {string} req.body.footballerId - The ID of the footballer to edit.
     * @param {string} req.body.property - The property of the footballer to edit.
     * @param {string} req.body.value - The new value for the property.
     * @param {string} req.body.referenceURL - The reference URL associated with the entity.
     * @param {string} req.body.token - The token for authorization.
     * @param {string} req.body.token_secret - The secret token for authorization.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the editing process.
     */
    editFootballerById: async (req, res) => {
        try {
			let { footballerId, property, value, referenceURL, token, token_secret } = req.body; 

			const result = await footballersService.editFootballerById(footballerId, property, value, referenceURL, token, token_secret);
			console.log("patatita");
            return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(500).json({ errors: errors} )
		}

    },

    /**
     * Retrieves footballers related to a specific relation.
     * @async
     * @function getFootballersRelation
     * @memberof footballersController
     * @param {Object} req - The request object.
     * @param {string} req.params.relacion - The relation to retrieve footballers for.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the retrieval process.
     */
    getFootballersRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let footballers = await footballersService.getFootballersRelation(relacion);
            setTimeout(() => {
                res.json(footballers)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = footballersController;