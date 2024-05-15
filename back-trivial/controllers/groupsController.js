const groupsService = require('../services/groupsService');

groupsController = {

    editGroupById: async (req, res) => {
        try {
			let { groupId, property, value, referenceURL, token, token_secret } = req.body; 
            //req.query -> url
            //req.body -> formulario html (deberán ser req.body el value, los demas no se)

			const result = await groupsService.editGroupById(groupId, property, value, referenceURL, token, token_secret);
			return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(errors[0].code).json({ errors: errors} )
		}

    },

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
