let footballersRouter = require("./footballersRouter");
let researchersRouter = require("./researchersRouter");
let groupsRouter = require("./groupsRouter");
const emptyPropertiesRouter = require("./emptyPropertiesRouter");

/**
 * Initializes and configures routers for the entities.
 * @param {Object} app 
 */
let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);
    app.use("/footballers/", footballersRouter);
    app.use("/groups/", groupsRouter);
    app.use("/properties/", emptyPropertiesRouter);
}

module.exports = initRouters