const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const util = require("util");
const { transporter } = require("../utils/nodemailer");
const { validEmail, emptyUser, fail, success, invalidEmail, expiredToken, notLoggedIn, unauthorized } = require("../utils/constants");
let login_token = "yip-json-login-token";
let cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
}

/*** Signup  function for new User***/
exports.Signup = async (req, res, next) => {
  try {
    let newUser = await new User(req.body);
    newUser = await newUser.save();
    let token = jwt.sign({ id: newUser._id }, login_token);
    res.cookie('jwt_review', token, cookieOptions)
    res.status(200).json({
      status: `${success}`,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: `${fail}`, message: err.message });
  }
};

/*** Login  function for existing User***/
exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: `${fail}`,
        message: `${validEmail}`,
      });
    }
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        status: `${fail}`,
        message: `${emptyUser}`,
      });
    }
    console.log(process.env.LOGIN_TOKIN);
    let comp = await bcrypt.compare(req.body.password, user.password);
    if (!comp) {
      return res
        .status(401)
        .send({ message: `${invalidEmail}` });
    }
    let token = jwt.sign({ id: user._id }, login_token);
    console.log(token);
    res.cookie('jwt_review', token, cookieOptions)
    res.status(200).json({
      status: "success"
    });
  } catch (err) {
    res.status(400).json({
      status: `${fail}`,
      message: err.message,
    });
  }
};

/*** Protect Routes against unauthorized users ***/
exports.Protect = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      let decoded = await util.promisify(jwt.verify)(token, login_token);
      let freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        res
          .status(401)
          .json({
            status: `${fail}`,
            message: `${expiredToken}`,
          });
      }
      req.user = freshUser;
      next();
      // Check whether user has changed password after token issued
    } else {
      res
        .status(403)
        .json({
          status: `${fail}`,
          message: `${notLoggedIn}`,
        });
    }
  } catch (err) {
    res.status(400).json({
      status: `${fail}`,
      message: err.message,
    });
  }
};

/*** Restrict Users---> Assigning roles and permissions ***/
exports.RestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ status: `${fail}`, message: `${unauthorized}` });
    }
    next();
  };
};

/*** Forget Password Query for Users ***/
exports.ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();
    
    // Send reset token via email (using nodemailer or any email service)
      transporter.sendMail({
        from: "saadshabbir@leilanitech.com",
        to: req.body.email,
        subject: "Reset Password",
        text: resetToken
      })
      
      res.json({ message: 'Password reset token sent to your email' });
    } catch (error) {
      console.error(error);
    res.status(500).json({ message: error.message });
  }
}

/*** Reset Password Query for Users ***/
exports.ResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}