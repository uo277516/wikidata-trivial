const rappersRepository = require("../repositories/rappersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

rappersService = {

    editRapperById: async(rapperId, property, value, referenceURL,token, token_secret) => {
        let errors = [];

        if (rapperId == undefined) {
            errors.push(new InputError("rapperId", "Invalid rapper ID"));
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
        if (referenceURL !== null && !referenceURL.startsWith("https://")) {
            errors.push(new InputError("referenceURL", "Reference URL does not follow 'https://' scheme"));
        }
        

        let info = await rappersRepository.editRapperById(rapperId, property, value, referenceURL,token, token_secret);
        
        if (info == null) {
            errors.push(new LogicError("Error editing rapper"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return true;
    },
    getRappersRelation: async (relation) => {
        let errors = [];
        let rappers = await rappersRepository.getRappersRelation(relation);
        
        if (rappers == null) {
            errors.push(new LogicError("Error accessing rappers"));
        }

        if (errors.length > 0) {
            throw errors;
        }
        return rappers;
    }
}

module.exports = rappersService;
