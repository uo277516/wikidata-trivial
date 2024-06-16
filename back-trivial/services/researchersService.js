const researchersRepository = require("../repositories/researchersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

researchersService = {

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
