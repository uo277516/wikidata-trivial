const emptyPropertiesService = require('../services/emptyPropertiesService');

emptyPropertiesController = {

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