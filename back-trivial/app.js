const express = require('express');

const initRouters = require("./routers/routers");

const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

initRouters(app);

app.listen(PORT, () => {
    console.log("Listening on port 3001");
})