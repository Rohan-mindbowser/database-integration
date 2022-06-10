const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let employee = new Schema({
  name: {
    type: String,
    minlength: [2, "Minimum length of Name is 2 character"],
    maxlength: [30, "Maximum length of Name is 30 character"],
    required: [true, "Employee Name is required"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Employee Email is required"],
    validate: {
      validator: function (v) {
        return /^[a-z]+(?!.*(?:\_{2,}|\.{2,}))(?:[\.+\_]{0,1}[a-z])*@[a-zA-Z]+\.[a-zA-Z]+$/g.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "Employee Password is required"],
    validate: {
      validator: function (v) {
        return /^(?=.{8,16})(?=.*[0-9])(?=.*[!*@#$%^&+=]).*$/.test(v);
      },
      message: (props) =>
        `Password must be a combination of characters, numbers and symbol`,
    },
  },
});

// hashing password here(.pre method is executed before .save method, so we can use .pre method to hash password and call next())
// employee.pre("save", async function (next) {
//   try {
//     const passwordHashed = await bcrypt.hash(this.password, 5);
//     this.password = passwordHashed;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// employee.methods.isValidPassword = async function (password, hashPassword) {
//   try {
//     return await bcrypt.compare(password, hashPassword, (result) => {
//       return result;
//     });
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = mongoose.model("employees", employee);
