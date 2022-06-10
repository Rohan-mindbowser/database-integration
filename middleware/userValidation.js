//validating employee name
function validateName(req, res, next) {
  var api_name = req.body.name;

  if (/^[a-zA-Z\s]*$/.test(api_name) === false) {
    res.status(400);
    res.send("Name must contain only alphabetics characters [A-Z | a-z]");
  } else if (
    (req.body.name.length >= 2 && req.body.name.length <= 30) === false
  ) {
    res.status(400);
    res.send("name length between 2 and 30");
  } else {
    next();
  }
}

//validating employee password
function validatePassword(req, res, next) {
  var api_password = req.body.password;
  if (
    /^(?=.{8,16})(?=.*[0-9])(?=.*[!*@#$%^&+=]).*$/.test(api_password) === false
  ) {
    res.status(400);
    res.send("password is not valid");
  } else {
    next();
  }
}

//validating employee email
function validateEmail(req, res, next) {
  var api_email = req.body.email;

  if (
    /^[a-z]+(?!.*(?:\_{2,}|\.{2,}))(?:[\.+\_]{0,1}[a-z])*@[a-zA-Z]+\.[a-zA-Z]+$/g.test(
      api_email
    ) === false
  ) {
    res.status(400);
    res.send("Email is not valid");
  } else {
    next();
  }
}

//Exporting validations
module.exports = {
  validateName,
  validateEmail,
  validatePassword,
};
