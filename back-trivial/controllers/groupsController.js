const groupsService = require('../services/groupsService');

/**
 * Controller for handling group-related requests.
 * @namespace groupsController
 */
groupsController = {


    /**
     * Edits a group entity by ID of the entity.
     * @async
     * @function editGroupById
     * @memberof groupsController
     * @param {Object} req - The request object.
     * @param {string} req.body.groupId - The ID of the group to edit.
     * @param {string} req.body.property - The property of the group to edit.
     * @param {string} req.body.value - The new value for the property.
     * @param {string} req.body.referenceURL - The reference URL associated with the entity.
     * @param {string} req.body.token - The token for authorization.
     * @param {string} req.body.token_secret - The secret token for authorization.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the editting process.
     */
    editGroupById: async (req, res) => {
        try {
			let { groupId, property, value, referenceURL, token, token_secret } = req.body; 

			const result = await groupsService.editGroupById(groupId, property, value, referenceURL, token, token_secret);
			return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(errors).json({ errors: errors} )
		}

    },

    /**
     * Retrieves groups related to a specific relation.
     * @async
     * @function getGroupsRelation
     * @memberof groupsController
     * @param {Object} req - The request object.
     * @param {string} req.params.relacion - The relation to retrieve groups for.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     * @throws {Object} If an error occurs during the retrieval process.
     */
    getGroupsRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let groups = await groupsService.getGroupsRelation(relacion);
            setTimeout(() => {
                res.json(groups)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = groupsController;
