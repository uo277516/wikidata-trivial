const footballerRepository = require("../repositories/footballersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

/**
 * Service layer for handling operations related to footballers.
 * @namespace footballersService
 */
footballersService = {

    /**
     * Edits a footballer's information by ID.
     * @async
     * @function editFootballerById
     * @memberof footballersService
     * @param {string} footballerId - The ID of the footballer to edit.
     * @param {string} property - The property to edit.
     * @param {string} value - The new value for the property.
     * @param {string} referenceURL - The URL of the reference of the entity data for the edit.
     * @param {string} token - OAuth token for authorization.
     * @param {string} token_secret - OAuth token secret for authorization.
     * @throws {InputError} Throws an InputError if any required parameter is missing or invalid.
     * @throws {LogicError} Throws a LogicError if there's an error editing the footballer.
     * @returns {boolean} Returns true if the footballer was edited successfully.
    */
    editFootballerById: async(footballerId, property, value, referenceURL,token, token_secret) => {
        let errors = [];

        if (footballerId == undefined) {
            errors.push(new InputError("footballerId", "Invalid footballer ID"));
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
        
        let info = await footballerRepository.editFootballerById(footballerId, property, value, referenceURL,token, token_secret);
        
        if (info == null) {
            errors.push(new LogicError("Error editing footballer"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return true;
    },

    /**
     * Retrieves footballers based on a specified relation.
     * @async
     * @function getFootballersRelation
     * @memberof footballersService
     * @param {string} relation - The relation to fetch footballers for.
     * @throws {LogicError} Throws a LogicError if there's an error accessing footballers.
     * @returns {Array<Object>|null} Returns an array of footballer objects if successful, null if unsuccessful.
    */
    getFootballersRelation: async (relation) => {
        let errors = [];
        let footballers = await footballerRepository.getFootballersRelation(relation);
        
        if (footballers == null) {
            errors.push(new LogicError("Error accessing footballers"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return footballers;
    }
}

module.exports = footballersService;
