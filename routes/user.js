var express = require("express"),
  router = express.Router();

const bcrypt = require("bcrypt");

//importing middleware
const {
  validateEmail,
  validateName,
  validatePassword,
} = require("../middleware/userMiddleware");

// importing db connection
const connection = require("../utils/dbConnection");

//signup route
router.post(
  "/signup",
  [validateName, validateEmail, validatePassword],
  (req, res) => {
    try {
      //query for duplicate email
      var checkEmailQuery = `SELECT emp_email FROM emp_table where emp_email=?`;
      connection.query(checkEmailQuery, [req.body.emp_email], (err, data) => {
        if (Object.keys(data).length === 0) {
          //hashing password
          const passwordHashed = bcrypt.hashSync(req.body.emp_password, 5);
          //query for inserting data in database
          var sql = `INSERT INTO emp_table (emp_id,emp_name,emp_email,emp_password)
      VALUES
      (
          ?, ?, ?, ?
      )`;
          connection.query(
            sql,
            [
              req.body.emp_id,
              req.body.emp_name,
              req.body.emp_email,
              passwordHashed,
            ],
            function (err, data) {
              if (err) {
                throw err;
              } else {
                res.send("Data inserted successfully..!");
              }
            }
          );
        } else {
          res.status(400);
          res.send("Email already exists..");
        }
      });
    } catch (error) {
      res.status(400);
      res.send("Something went wrong...!");
    }
  }
);

//login route
router.post("/login", [validateEmail, validatePassword], (req, res) => {
  try {
    const sql = "SELECT emp_password FROM emp_table WHERE emp_email=?";
    connection.query(sql, [req.body.emp_email], (err, result, fields) => {
      if (Object.keys(result).length === 0) {
        res.status(404);
        res.send("Email not found..");
      } else {
        const userHashedPassword = result[0]["emp_password"];
        if (userHashedPassword) {
          bcrypt
            .compare(req.body.emp_password, userHashedPassword)
            .then((data) => {
              if (data) {
                res.send("Login Success..");
              } else {
                res.status(400);
                res.send("Wrong Password...");
              }
            });
        }
      }
    });
  } catch (error) {
    res.status(400);
    res.send("Something went wrong...!");
  }
});

//update route
router.patch("/", [validateName, validatePassword], (req, res) => {
  try {
    const passwordHashed = bcrypt.hashSync(req.body.emp_password, 5);
    const sql = "UPDATE emp_table SET emp_name=?,emp_password=? WHERE emp_id=?";
    connection.query(
      sql,
      [req.body.emp_name, passwordHashed, req.query.emp_id],
      (err, result, fields) => {
        if (err) throw err;
        if (result["changedRows"] >= 1) {
          res.send("Update success");
        } else {
          res.status(400);
          res.send("ID not found....");
        }
      }
    );
  } catch (error) {
    res.status(400);
    res.send("Something went wrong...!");
  }
});

//delete route
router.delete("/", (req, res) => {
  try {
    const sql = "DELETE FROM emp_table where emp_id=?";
    connection.query(sql, [req.query.emp_id], (err, result, fields) => {
      if (err) throw err;
      if (result["affectedRows"] >= 1) {
        res.send("Delete success");
      } else {
        res.status(400);
        res.send("User not found....");
      }
    });
  } catch (error) {
    res.status(400);
    res.send("Something went wrong...!");
  }
});

//exporting routes
module.exports = router;
