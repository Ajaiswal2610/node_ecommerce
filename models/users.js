const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (password) {
  try {
  return await bcrypt.compare(password, this.password);
  } catch (error) {
  throw new Error(error);
  }
 };
const user_model = mongoose.model("users", UserSchema);


 

module.exports  = user_model;