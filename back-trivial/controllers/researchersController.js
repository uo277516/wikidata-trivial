const researchersRepository = require('../services/researchersService');

researchersController = {

    editResearcherById: async (req, res) => {
        try {
            let info = await researchersRepository.editResearcherById();
            setTimeout(() => {
                res.json(info)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    },


    getResearchers: async (req, res) => {
        try {
            let researchers = await researchersRepository.getResearchers();
            setTimeout(() => {
                res.json(researchers)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    },
    getResearchersRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let researchers = await researchersRepository.getResearchersRelation(relacion);
            setTimeout(() => {
                res.json(researchers)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = researchersController;