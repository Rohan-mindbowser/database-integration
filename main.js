const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// importing db connection
const connection = require("./utils/dbConnection");

//importing routes
const userRoute = require("./routes/user");

//setting user routes
app.use("/api/user", userRoute);

//server running
app.listen(3000, () => {
  console.log("Server running on port 3000...!");
  connection.connect((err) => {
    if (err) console.log(err);
    console.log("Db Connection success...!");
  });
});
