const express = require("express");
const researchersController = require('../controllers/researchersController');

const researchersRouter = express.Router();

researchersRouter.get("/", researchersController.getResearchers);

module.exports = researchersRouter