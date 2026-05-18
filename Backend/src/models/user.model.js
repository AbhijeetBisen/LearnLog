const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    rollno: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 10,
    },

    mobile: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 10,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
