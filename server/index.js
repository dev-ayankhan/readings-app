const express = require("express");
require("dotenv").config();
require("./connection");
const routes = require("./routes/router");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", routes);

app.listen(process.env.APP_PORT || 3000);

module.exports = app;
