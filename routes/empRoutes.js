const router = require("express").Router();
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../middleware/userValidation");

//Importing employees model
const empModel = require("../models/empModel");

// SIGNUP ROUTE
router.post("/signup", async (req, res, next) => {
  try {
    const emailExist = await empModel.findOne({ email: req.body.email });
    if (emailExist) {
      throw createError.Conflict(
        `${req.body.email} is already been registered`
      );
    } else {
      const passwordHashed = bcrypt.hashSync(req.body.password, 5);
      req.body.password = passwordHashed;
      const employee = await empModel.create(req.body);
      await employee.save();
      res.status(201).send("Signup success..!!");
    }
  } catch (error) {
    next(error);
  }
});

//LOGIN ROUTE
router.post(
  "/login",
  [validateEmail, validatePassword],
  async (req, res, next) => {
    try {
      const employee = await empModel.findOne({
        email: req.body.email,
      });
      if (!employee) {
        throw createError.NotFound(`User Not Found`);
      }
      bcrypt
        .compare(req.body.password, employee["password"])
        .then((result) => {
          if (result) {
            res.status(200).send("Login success..!!");
          } else {
            throw createError.Unauthorized("Email/Password Invalid");
          }
        })
        .catch((e) => {
          next(e);
        });
    } catch (error) {
      next(error);
    }
  }
);

//UPDATE ROUTE
router.patch("/", [validateName, validatePassword], async (req, res, next) => {
  try {
    const emailExist = await empModel.findOne({ email: req.query.email });
    if (emailExist) {
      const passwordHashed = bcrypt.hashSync(req.body.password, 5);
      empModel.updateOne(
        { email: req.query.email },
        { $set: { name: req.body.name, password: passwordHashed } },
        (err, data) => {
          if (err) {
            throw createError.BadRequest("Something went wrong..!");
          }
          res.send("Update success..!!");
        }
      );
    } else {
      throw createError.NotFound(`User Not Found`);
    }
  } catch (error) {
    next(error);
  }
});

//DELETE ROUTE
router.delete("/", async (req, res, next) => {
  try {
    const employeExist = await empModel.findOne({ email: req.query.email });
    if (employeExist) {
      const deleteEmp = await empModel.deleteMany({ email: req.query.email });
      console.log(deleteEmp["deletedCount"]);
      if (deleteEmp["deletedCount"] >= 1) {
        res.status(200).send("Delete Success..!!");
      } else {
        throw createError.BadRequest("Something went wrong..!");
      }
    } else {
      throw createError.NotFound("Employee not found...!!");
    }
  } catch (error) {
    next(error);
  }
});

//Exporting routes
module.exports = router;
