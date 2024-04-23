const footballerRepository = require("../repositories/footballersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

footballersService = {

    editResearcherById: async(footballerId, property, value, referenceURL) => {
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
        if (referenceURL !== null && !referenceURL.startsWith("https://")) {
            errors.push(new InputError("referenceURL", "Reference URL does not follow 'https://' scheme"));
        }
        

        let info = await footballerRepository.editResearcherById(footballerId, property, value, referenceURL);
        
        if (info == null) {
            errors.push(new LogicError("Error editing footballer"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return true;
    },
    getFootballersRelation: async (relation) => {
        let errors = [];
        let researchers = await footballerRepository.getFootballersRelation(relation);
        
        if (researchers == null) {
            errors.push(new LogicError("Error accessing footballers"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return researchers;
    }
}

module.exports = footballersService;
