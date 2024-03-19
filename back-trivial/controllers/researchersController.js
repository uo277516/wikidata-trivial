const researchersRepository = require('../services/researchersService');

researchersController = {
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

    }
}

module.exports = researchersController;