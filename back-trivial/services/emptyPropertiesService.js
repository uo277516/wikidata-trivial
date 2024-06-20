const emptyPropertiesRepository = require("../repositories/emptyPropertiesRepository");
const LogicError = require("../errors/logicError");

/**
 * Service layer for retrieving empty properties related to a given entity and relations.
 * @module emptyPropertiesService
 */
emptyPropertiesService = {
   
    /**
     * Retrieves empty properties for a specified entity and its related properties.
     * @async
     * @param {string} entity 
     * @param {string} relations 
     * @returns {Promise<Object|null>} 
     * @throws {LogicError[]} 
    */
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
