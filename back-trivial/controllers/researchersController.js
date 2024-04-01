const researchersService = require('../services/researchersService');

researchersController = {

    editResearcherById: async (req, res) => {
        try {
			let { researcherId, property, value, referenceURL } = req.query; 
            //req.query -> url
            //req.body -> formulario html (deberán ser req.body el value, los demas no se)

			const result = await researchersService.editResearcherById(researcherId, property, value, referenceURL);
			return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(errors[0].code).json({ errors: errors} )
		}

    },


    getResearchers: async (req, res) => {
        try {
            let researchers = await researchersService.getResearchers();
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
            let researchers = await researchersService.getResearchersRelation(relacion);
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