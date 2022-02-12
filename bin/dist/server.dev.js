"use strict";

var mongoose = require("mongoose");

var app = require("../app");

require("dotenv").config();

mongoose.Promise = global.Promise;
var PORT = process.env.PORT || 3000;

try {
  var session = mongoose.connect(process.env.DB_HOST_REMOTE);
  session.then(function (data) {
    data.connections[0].name && app.listen(PORT, function () {
      var _data$connections$ = data.connections[0],
          port = _data$connections$.port,
          name = _data$connections$.name;
      console.log("Database connection successfully. DB name is \"".concat(name, "\" on port \"").concat(port, "\"."));
      console.log("PORT", PORT);
    });
  });
} catch (error) {
  console.log("DB connection Error: ");
  process.exit(1);
}

module.exports = mongoose;