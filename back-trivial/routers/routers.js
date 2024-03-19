let researchersRouter = require("./researchersRouter");

let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);

}

module.exports = initRouters