const groupsRepository = require("../repositories/groupsRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

const groupsService = {

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
        console.log("--"+referenceURL);
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
