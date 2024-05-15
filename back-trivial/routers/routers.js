let footballersRouter = require("./footballersRouter");
let researchersRouter = require("./researchersRouter");
let groupsRouter = require("./groupsRouter");

let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);
    app.use("/footballers/", footballersRouter);
    app.use("/groups/", groupsRouter);
}

module.exports = initRouters