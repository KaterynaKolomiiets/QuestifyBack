const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  host: [{ type: String }],
  tmpHost: { type: String, default: null },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  resetLink: { type: String, default: null },
});

module.exports = model("User", UserSchema);
