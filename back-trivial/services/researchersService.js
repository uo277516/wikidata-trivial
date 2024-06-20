const researchersRepository = require("../repositories/researchersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

/**
 * Service layer for handling operations related to researchers.
 * @namespace researchersService
 */
researchersService = {

    /**
     * Edits a researcher's entity by ID.
     * @async
     * @function editResearcherById
     * @memberof researchersService
     * @param {string} researcherId - The ID of the researcher to edit.
     * @param {string} property - The property to edit.
     * @param {string} value - The new value for the property.
     * @param {string} referenceURL - The URL of the reference for the edit.
     * @param {string} token - OAuth token for authorization.
     * @param {string} token_secret - OAuth token secret for authorization.
     * @throws {InputError} Throws an InputError if any required parameter is missing or invalid.
     * @throws {LogicError} Throws a LogicError if there's an error editing the researcher.
     * @returns {boolean} Returns true if the researcher was edited successfully.
     */
    editResearcherById: async(researcherId, property, value, referenceURL, token, token_secret) => {
        let errors = [];

        if (researcherId == undefined) {
            errors.push(new InputError("researcherId", "Invalid researcher ID"));
        }
        if (property == undefined) {
            errors.push(new InputError("property", "Undefined relationship property"));
        }
        if (value == undefined) {
            errors.push(new InputError("value", "Undefined value"));
        }
        if (referenceURL == undefined) {
            errors.push(new InputError("referenceURL", "Undefined reference URL"));
        }
        if (referenceURL === null || (!referenceURL.startsWith("https://") && !referenceURL.startsWith("http://"))) {
            errors.push(new InputError("referenceURL", "Reference URL does not follow 'http(s)://' scheme"));
        }
        

        let info = await researchersRepository.editResearcherById(researcherId, property, value, referenceURL, token, token_secret);
        
        if (info == null) {
            errors.push(new LogicError("Error editing researcher"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return true;
    },

    /**
     * Retrieves researchers.
     * @async
     * @function getResearchers
     * @memberof researchersService
     * @throws {LogicError} Throws a LogicError if there's an error accessing researchers.
     * @returns {Array<Object>|null} Returns an array of researcher objects if successful, null if unsuccessful.
     */
    getResearchers: async () => {
        let errors = [];
        let researchers = await researchersRepository.getResearchers();
        
        if (researchers == null) {
            errors.push(new LogicError("Error accessing researchers"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return researchers;
    }, 

    /**
     * Retrieves researchers based on a specified relation.
     * @async
     * @function getResearchersRelation
     * @memberof researchersService
     * @param {string} relation - The relation to fetch researchers for.
     * @throws {LogicError} Throws a LogicError if there's an error accessing researchers.
     * @returns {Array<Object>|null} Returns an array of researcher objects if successful, null if unsuccessful.
     */
    getResearchersRelation: async (relation) => {
        let errors = [];
        let researchers = await researchersRepository.getResearchersRelation(relation);
        
        if (researchers == null) {
            errors.push(new LogicError("Error accessing researchers"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return researchers;
    }
}

module.exports = researchersService;
