"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var userService = require("../../service/auth/userService");

var ApiError = require("../../service/auth/apiError");

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: "registration",
    value: function registration(req, res, next) {
      var _req$body, name, email, password, ip, host, userData;

      return regeneratorRuntime.async(function registration$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
              ip = req.headers.hrmt;
              host = Buffer.from(ip, "base64").toString();
              _context.next = 6;
              return regeneratorRuntime.awrap(userService.registration(name, email, password, host));

            case 6:
              userData = _context.sent;
              res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
              });
              return _context.abrupt("return", res.status(201).json(userData));

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              next(_context.t0);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 11]]);
    }
  }, {
    key: "login",
    value: function login(req, res, next) {
      var _req$body2, email, password, ip, host, userData;

      return regeneratorRuntime.async(function login$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
              ip = req.headers.hrmt;
              host = Buffer.from(ip, "base64").toString();
              console.log("host", host);
              _context2.next = 7;
              return regeneratorRuntime.awrap(userService.login(email, password, host));

            case 7:
              userData = _context2.sent;
              res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
              });
              return _context2.abrupt("return", res.json(userData));

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }, {
    key: "logout",
    value: function logout(req, res, next) {
      var refreshToken, token;
      return regeneratorRuntime.async(function logout$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              // const { refreshToken } = req.cookies;
              refreshToken = req.headers.update.slice(req.headers.update.indexOf("=") + 1);
              _context3.next = 4;
              return regeneratorRuntime.awrap(userService.logout(refreshToken));

            case 4:
              token = _context3.sent;
              res.clearCookie("refreshToken");
              return _context3.abrupt("return", res.status(200).json({
                message: "logout success"
              }));

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](0);
              next(_context3.t0);

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "activate",
    value: function activate(req, res, next) {
      var activationLink;
      return regeneratorRuntime.async(function activate$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              activationLink = req.params.link;
              _context4.next = 4;
              return regeneratorRuntime.awrap(userService.activate(activationLink));

            case 4:
              return _context4.abrupt("return", res.redirect(process.env.CLIENT_URL));

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "refresh",
    value: function refresh(req, res, next) {
      var refreshToken, userData;
      return regeneratorRuntime.async(function refresh$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              refreshToken = req.headers.update.slice(req.headers.update.indexOf("=") + 1); // const { refreshToken } = req.cookies;

              _context5.next = 4;
              return regeneratorRuntime.awrap(userService.refresh(refreshToken));

            case 4:
              userData = _context5.sent;
              res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000 // httpOnly: true,

              });
              return _context5.abrupt("return", res.json(userData));

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](0);
              next(_context5.t0);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(req, res, next) {
      var link;
      return regeneratorRuntime.async(function resetPassword$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(userService.resetPasswordRequest(req.body.email));

            case 3:
              link = _context6.sent;
              return _context6.abrupt("return", res.redirect("/"));

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](0);
              next(_context6.t0);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "changePasswordController",
    value: function changePasswordController(req, res, next) {
      var resetLink, newPassword;
      return regeneratorRuntime.async(function changePasswordController$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              resetLink = req.params.link;
              _context7.next = 4;
              return regeneratorRuntime.awrap(userService.changePassword(req.body.password, resetLink));

            case 4:
              newPassword = _context7.sent;
              return _context7.abrupt("return", res.json({
                message: "password change successfully"
              }));

            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7["catch"](0);
              next(_context7.t0);

            case 11:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "confirmHost",
    value: function confirmHost(req, res, next) {
      var result;
      return regeneratorRuntime.async(function confirmHost$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(userService.confirmNewHost(req.params.link));

            case 3:
              result = _context8.sent;

              if (!result) {
                _context8.next = 7;
                break;
              }

              console.log("result", result);
              return _context8.abrupt("return", res.redirect("".concat(process.env.CLIENT_URL, "/api/users/change-password/").concat(result)));

            case 7:
              return _context8.abrupt("return", res.redirect("".concat(process.env.CLIENT_URL, "/auth")));

            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8["catch"](0);
              next(_context8.t0);

            case 13:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }]);

  return UserController;
}();

module.exports = new UserController();