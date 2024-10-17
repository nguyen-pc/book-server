const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      min: 5,
    },
    gender: {
      type: String,
      default: "unknow" | "0" | "1",
    },
    phoneNumber: {
      type: String,
      require: true,
      unique: true,
    },
    birthday: {
      type: Date,
      default: () => Date.now(),
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    refresh_token: String,
  },
  {
    virtuals: {
      full_name: {
        get() {
          return this.first_name + " " + this.last_name;
        },
      },
      id: {
        get() {
          return this._id;
        },
      },
    },
  }
);

module.exports = mongoose.model("User", UserSchema);
