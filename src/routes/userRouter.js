const express = require("express");
const router = express.Router();
const {
  signUpController,
  loginController,
  changePassword,
  logedUser,
  resetPassword,
  resetPasswordByLink,
} = require("../Controller/userController");
const authVarification = require("../Middleware/authVarification");

// create user router

router.post("/signup", signUpController);

// login router
router.post("/login", loginController);

// change password

router.post("/changepassword", authVarification, changePassword);

// loged user details

router.get("/logeduser", authVarification, logedUser);

// reset password

router.post("/resetpassword", resetPassword);
// reset password by click link
router.post("/resetpassword/:id/:token", resetPasswordByLink);

module.exports = router;
