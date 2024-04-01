const researchersRepository = require("../repositories/researchersRepository");
const LogicError = require("../errors/logicError");
const InputError = require("../errors/inputError");

//aqui controlaria errores tipo si fueran d meter cosas el usuario
researchersService = {

    editResearcherById: async(researcherId, property, value, referenceURL) => {
        let errores = [];

        console.log("hola",referenceURL);


        if (researcherId == undefined) {
            errores.push(new InputError("researcherId", "Id del investigador no válido"));
        }
        if (property == undefined) {
            errores.push(new InputError("property", "Propiedad de relación no definida"));
        }
        if (value == undefined) {
            errores.push(new InputError("value", "Valor no definido"));
        }
        if (referenceURL == undefined) {
            errores.push(new InputError("referenceURL", "URL de referencia no definida"));
        }
        console.log("hola!!!!  " + referenceURL);
        if (referenceURL ==! null && !referenceURL.startsWith("https://")) {
            errores.push(new InputError("referenceURL", "URL de referencia no sigue un esquema 'https://'"));
        }
        

        let info = await researchersRepository.editResearcherById(researcherId, property, value, referenceURL);
        
        if (info==null) {
            errores.push(new LogicError("Error al editar el investigador"));
        }

        if (errores.length>0) {
            throw errores;
        }
        return true;
    },
    getResearchers: async () => {
        let errores = [];
        let researchers = await researchersRepository.getResearchers();
        
        if (researchers==null) {
            errores.push(new LogicError("Error al acceder a los investigadores"));
        }

        if (errores.length>0) {
            throw errores;
        }
        return researchers;
    }, 
    getResearchersRelation: async (relacion) => {
        let errores = [];
        let researchers = await researchersRepository.getResearchersRelation(relacion);
        
        if (researchers==null) {
            errores.push(new LogicError("Error al acceder a los investigadores"));
        }

        if (errores.length>0) {
            throw errores;
        }
        return researchers;
    }
}

module.exports=researchersService;