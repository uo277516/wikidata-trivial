const emptyPropertiesRepository = require("../repositories/emptyPropertiesRepository");
const LogicError = require("../errors/logicError");

emptyPropertiesService = {
   
    getEmptyProperties: async (entity, relations) => {
        let errors = [];
        let properties = await emptyPropertiesRepository.getEmptyProperties(entity, relations);
        
        if (properties == null) {
            errors.push(new LogicError("Error accessing properties"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return properties;
    }
}

module.exports = emptyPropertiesService;
