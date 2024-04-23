let footballersRouter = require("./footballersRouter");
let researchersRouter = require("./researchersRouter");

let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);
    app.use("/footballers/", footballersRouter);
}

module.exports = initRouters