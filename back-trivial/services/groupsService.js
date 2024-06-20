const groupsRepository = require("../repositories/groupsRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

/**
 * Service layer for handling operations related to groups.
 * @namespace groupsService
*/
const groupsService = {

    /**
     * Edits a group's information by ID.
     * @async
     * @function editGroupById
     * @memberof groupsService
     * @param {string} groupId - The ID of the group to edit.
     * @param {string} property - The property to edit.
     * @param {string} value - The new value for the property.
     * @param {string} referenceURL - The URL of the reference of data where it is found the information.
     * @param {string} token - OAuth token for authorization.
     * @param {string} token_secret - OAuth token secret for authorization.
     * @throws {InputError} Throws an InputError if any required parameter is missing or invalid.
     * @throws {LogicError} Throws a LogicError if there's an error editing the group.
     * @returns {boolean} Returns true if the group was edited successfully.
    */
    editGroupById: async(groupId, property, value, referenceURL, token, token_secret) => {
        let errors = [];

        if (groupId == undefined) {
            errors.push(new InputError("groupId", "Invalid group ID"));
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
        
        let info = await groupsRepository.editGroupById(groupId, property, value, referenceURL, token, token_secret);
        
        if (info == null) {
            errors.push(new LogicError("Error editing group"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return true;
    },

    /**
     * Retrieves groups based on a specified relation.
     * @async
     * @function getGroupsRelation
     * @memberof groupsService
     * @param {string} relation - The relation to fetch groups for.
     * @throws {LogicError} Throws a LogicError if there's an error accessing groups.
     * @returns {Array<Object>|null} Returns an array of group objects if successful, null if unsuccessful.
    */
    getGroupsRelation: async (relation) => {
        let errors = [];
        let groups = await groupsRepository.getGroupsRelation(relation);
        
        if (groups == null) {
            errors.push(new LogicError("Error accessing groups"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return groups;
    }
}

module.exports = groupsService;
