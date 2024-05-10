const rappersService = require('../services/rappersService');

rappersController = {

    editRapperById: async (req, res) => {
        try {
			let { rapperId, property, value, referenceURL, token, token_secret } = req.body; 
            //req.query -> url
            //req.body -> formulario html (deberán ser req.body el value, los demas no se)

			const result = await rappersService.editRapperById(rapperId, property, value, referenceURL, token, token_secret);
			return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(errors[0].code).json({ errors: errors} )
		}

    },

    getRappersRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let rappers = await rappersService.getRappersRelation(relacion);
            setTimeout(() => {
                res.json(rappers)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = rappersController;