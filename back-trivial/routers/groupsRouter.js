const express = require("express");
const groupsController = require('../controllers/groupsController');

const groupsRouter = express.Router();

groupsRouter.post("/", groupsController.editGroupById);
groupsRouter.get("/:relacion", groupsController.getGroupsRelation);

module.exports = groupsRouter;
