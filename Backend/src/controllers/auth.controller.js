const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMailTo = require("../services/mail.service");

const registerController = async (req, res) => {
  try {
    let { name, email, mobile, rollno, password } = req.body;

    if (!name || !email || !mobile || !rollno || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let isExisted = await UserModel.findOne({ email });

    if (isExisted) {
      return res.status(409).json({
        success: false,
        message: "User already existed",
      });
    }

    let hashPass = await bcrypt.hash(password, 10);

    let newUser = await UserModel.create({
      name,
      email,
      mobile,
      rollno,
      password: hashPass,
    });

    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    newUser.verificationToken = verificationToken;

    await newUser.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendMailTo(
      email,
      "Verify Email",
      `<h2>Email Verification</h2>
      <a href="${verificationLink}">Verify Email</a>`,
    );

    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verify your email.",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyEmailController = async (req, res) => {
  try {
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    let check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const meController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  meController,
};
