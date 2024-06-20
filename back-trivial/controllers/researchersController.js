const researchersService = require('../services/researchersService');

researchersController = {


    /**
     * Edits a researcher's information by ID of the researcher.
     * @async
     * @function editResearcherById
     * @memberof researchersController
     * @param {Object} req - The request object.
     * @param {string} req.body.researcherId - The ID of the researcher to edit.
     * @param {string} req.body.property - The property of the researcher to edit.
     * @param {string} req.body.value - The new value for the property.
     * @param {string} req.body.referenceURL - The reference URL associated with the entity.
     * @param {string} req.body.token - The token for authorization.
     * @param {string} req.body.token_secret - The secret token for authorization.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the editing process.
     */
    editResearcherById: async (req, res) => {
        try {
			let { researcherId, property, value, referenceURL, token, token_secret } = req.body; 

			const result = await researchersService.editResearcherById(researcherId, property, value, referenceURL, token, token_secret);
			return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(500).json({ errors: errors} )
		}

    },

    /**
     * Retrieves all researchers. 
     * @async
     * @function getResearchers
     * @memberof researchersController
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the retrieval process.
     */
    getResearchers: async (req, res) => {
        try {
            let researchers = await researchersService.getResearchers();
            setTimeout(() => {
                res.json(researchers)
            }, 3000);
        }
        catch (errors) {
            return res.status(500).json({ errors: errors} )
        }

    },

    /**
     * Retrieves researchers related to a specific relation.
     * @async
     * @function getResearchersRelation
     * @memberof researchersController
     * @param {Object} req - The request object.
     * @param {string} req.params.relacion - The relation to retrieve researchers for.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the retrieval process.
     */
    getResearchersRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let researchers = await researchersService.getResearchersRelation(relacion);
            setTimeout(() => {
                res.json(researchers)
            }, 3000);
        }
        catch (errors) {
            return res.status(500).json({ errors: errors} )
        }

    }
}

module.exports = researchersController;