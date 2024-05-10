let footballersRouter = require("./footballersRouter");
let researchersRouter = require("./researchersRouter");
let rappersRouter = require("./rappersRouter");

let initRouters = (app) => {
    app.use("/researchers/", researchersRouter);
    app.use("/footballers/", footballersRouter);
    app.use("/rappers", rappersRouter);
}

module.exports = initRouters