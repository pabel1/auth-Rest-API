const bcrypt = require("bcrypt");
const UserModel = require("../Models/userModels");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/emailCongfig");

// signUp function
const signUpController = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword, trams } =
    req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.status(500).json({
      status: "failed",
      message: "Email already exist!",
    });
  } else {
    try {
      if (
        firstname &&
        lastname &&
        email &&
        password &&
        confirmPassword &&
        trams
      ) {
        if (password === confirmPassword) {
          const hashPassword = await bcrypt.hash(req.body.password, 10);
          const user = new UserModel({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPassword,
            trams: trams,
          });
          await user.save();
          const token = await jwt.sign(
            {
              email: user.email,
              id: user._id,
            },
            process.env.JWT_TOKEN,
            {
              expiresIn: "2d",
            }
          );

          res.status(200).json({
            status: "success",
            message: "Data insert Successful!",
            access_token: token,
          });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Fill Same Password!",
          });
        }
      } else {
        res.status(400).json({
          status: "failed",
          message: "All field are Required!",
        });
      }
    } catch (message) {
      res.status(500).json({
        status: "failed",
        message: "Server side Error!",
      });
    }
  }
};

// loginController

const loginController = async (req, res) => {
  try {
    const user = await UserModel.find({ email: req.body.email });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            email: user[0].email,
            id: user[0]._id,
          },
          process.env.JWT_TOKEN,
          {
            expiresIn: "5d",
          }
        );
       
        res.status(200).json({
          status:"success",
          message: "Login Success",
          access_token: token,
        });
      } else {
        res.status(401).json({
          status: "failed",
          message: "Authentication Failed!",
        });
      }
    } else {
      res.status(401).json({
        status: "failed",
        message: "Authentication Failed!",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "failed",
      error: "Authentication Failed!",
    });
  }
};

// change password
const changePassword = async (req, res, next) => {
  const { newPassword, confirmNewPassword } = req.body;
  if (newPassword && confirmNewPassword) {
    if (newPassword === confirmNewPassword) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      console.log(req.email);
      console.log(req.id);

      await UserModel.updateOne(
        { _id: req.id },
        {
          $set: {
            password: hashPassword,
          },
        }
      );
      res.status(200).json({
        status: "success",
        message: "Password Change Successful!",
      });
    } else {
      res.status(500).json({
        status: "failed",
        message: "Same Password are Required!",
      });
    }
  } else {
    res.status(500).json({
      status: "failed",
      message: "All fields are Required!",
    });
  }
};

// loged user details
const logedUser = async (req, res) => {
  try {
    const logedUserData = await UserModel.findOne({ _id: req.id });
    res.status(200).json({
      user: logedUserData,
    });
  } catch (error) {}
};

//  reset password by email 
const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_TOKEN;
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret,
        {
          expiresIn: "20m",
        }
      );
      const link = `http://localhost:3000/user/resetpassword/${user._id}/${token}`;

      // let info = await transporter.sendMail({
      //   from: process.env.EMAIL_FROM,
      //   to: user.email,
      //   subject: "Reset Password Link",
      //   html: `<a href=${link}> Click Here</a> to Reset Your Password `,
      // });
      console.log(link);
      res.status(200).json({
        status: "success",
        message: "password reset email sent ... please check your email!",
        // info: info,
      });
    } else {
      res.status(500).json({
        status: "failed",
        message: "Email is not Exist!",
      });
    }
  } else {
    res.status(500).json({
      status: "failed",
      message: "Enter Valid Email First!",
    });
  }
};

// reset password by click link

const resetPasswordByLink = async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findOne({ id });
  const new_secret = user._id + process.env.JWT_TOKEN;
  try {
    jwt.verify(token, new_secret);
    if (newPassword && confirmNewPassword) {
      if (newPassword === confirmNewPassword) {
        const newHashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.updateOne(
          { id: user._id },
          { $set: { password: newHashPassword } }
        );
        res.status(200).json({
          status: "success",
          message: "Password Reset Successful!",
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Enter Same Password!",
        });
      }
    } else {
      res.status(500).json({
        status: "failed",
        message: "Fill All the Requirment First!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Something wrong !",
    });
  }
};

module.exports = {
  signUpController,
  loginController,
  changePassword,
  logedUser,
  resetPassword,
  resetPasswordByLink,
};
