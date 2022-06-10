const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require("mongoose");
const createError = require("http-errors");

//Importing DB connection
const connection = require("./config/dbConnection");

//Checking DB connection here
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

//Importing employee model
const empModel = require("./models/empModel");

//importing routes
const empRoute = require("./routes/empRoutes");

//setting user routes
app.use("/api/emp", empRoute);

//handling errors
app.use(async (req, res, next) => {
  next(createError.NotFound("Route Not Found"));
});

//Handling errors in this middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

//server running
app.listen(3000, () => {
  console.log("Server running on port 3000...!");
});
