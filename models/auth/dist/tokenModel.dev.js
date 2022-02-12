"use strict";

var _require = require("mongoose"),
    Schema = _require.Schema,
    model = _require.model;

var TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  refreshToken: {
    type: String,
    required: true
  }
});
module.exports = model("Token", TokenSchema);