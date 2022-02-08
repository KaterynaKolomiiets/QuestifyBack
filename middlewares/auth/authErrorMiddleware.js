const ApiError = require("../../service/auth/apiError");

module.exports = function (err, req, res, next) {
  console.log("ERRRROORR", err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Internal Server Error", error: err });
};
