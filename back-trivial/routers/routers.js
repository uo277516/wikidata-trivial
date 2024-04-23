let researchersRouter = require("./researchersRouter");
let footballersRouter = require("./footballersRouter");

let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);
    app.use("/footballers/", footballersRouter);
}

module.exports = initRouters