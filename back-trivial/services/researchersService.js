const researchersRepository = require("../repositories/researchersRepository");
const LogicError = require("../errors/logicError");

//aqui controlaria errores tipo si fueran d meter cosas el usuario
researchersService = {
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