const footballersService = require('../services/footballersService');

footballersController = {

    editFootballerById: async (req, res) => {
        try {
			let { footballerId, property, value, referenceURL, token, token_secret } = req.body; 
            //req.query -> url
            //req.body -> formulario html (deberán ser req.body el value, los demas no se)

			const result = await footballersService.editFootballerById(footballerId, property, value, referenceURL, token, token_secret);
			console.log("patatita");
            return res.json({"result": result})
		}
		catch (errors) {
            console.log(errors);
			return res.status(500).json({ errors: errors} )
		}

    },

    getFootballersRelation: async (req, res) => {
        try {
            let relacion = req.params.relacion;
            let footballers = await footballersService.getFootballersRelation(relacion);
            setTimeout(() => {
                res.json(footballers)
            }, 3000);
        }
        catch (errors) {
            return res.status(errors[0].code).json({ errors: errors} )
        }

    }
}

module.exports = footballersController;