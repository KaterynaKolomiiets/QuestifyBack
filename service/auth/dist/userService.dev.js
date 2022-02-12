"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserModel = require("../../models/auth/userModel");

var TokenModel = require("../../models/auth/tokenModel");

var bcrypt = require("bcrypt");

var uuid = require("uuid");

var sgMail = require("@sendgrid/mail");

var tokenService = require("./tokenService");

var UserDto = require("../../dtos/user-dto");

var ApiError = require("../auth/apiError");

var jwt = require("jsonwebtoken");

var _require = require("./mailService"),
    confirmEmail = _require.confirmEmail,
    forgotPasswordEmail = _require.forgotPasswordEmail,
    checkNewHostEmail = _require.checkNewHostEmail;

var UserService =
/*#__PURE__*/
function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, [{
    key: "registration",
    value: function registration(name, email, password, host) {
      var candidate, hashPassword, activationLink, user, mail, msg, newUser;
      return regeneratorRuntime.async(function registration$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              _context.next = 3;
              return regeneratorRuntime.awrap(UserModel.findOne({
                email: email
              }));

            case 3:
              candidate = _context.sent;

              if (!candidate) {
                _context.next = 6;
                break;
              }

              throw ApiError.Conflict("Email ".concat(email, " in use!"));

            case 6:
              _context.next = 8;
              return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

            case 8:
              hashPassword = _context.sent;
              activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

              console.log("host", host);
              _context.next = 13;
              return regeneratorRuntime.awrap(UserModel.create({
                name: name,
                email: email,
                password: hashPassword,
                activationLink: activationLink,
                host: host
              }));

            case 13:
              user = _context.sent;
              mail = confirmEmail("".concat(process.env.API_URL, "/api/users/activate/").concat(activationLink), name);
              msg = {
                to: email,
                from: "maintenance.questify@gmail.com",
                subject: "Please, confirm Your Email!",
                text: "Here is Your verification link - ".concat(process.env.API_URL, "/api/users/activate/").concat(activationLink),
                html: mail
              };
              _context.next = 18;
              return regeneratorRuntime.awrap(sgMail.send(msg));

            case 18:
              _context.next = 20;
              return regeneratorRuntime.awrap(UserModel.findOne({
                email: email
              }));

            case 20:
              newUser = _context.sent;
              return _context.abrupt("return", {
                name: newUser.name,
                email: newUser.email,
                id: newUser.id,
                isActivated: user.isActivated
              });

            case 22:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "activate",
    value: function activate(activationLink) {
      var user;
      return regeneratorRuntime.async(function activate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(UserModel.findOne({
                activationLink: activationLink
              }));

            case 2:
              user = _context2.sent;

              if (user) {
                _context2.next = 5;
                break;
              }

              throw ApiError.BadRequest("Wrong activation link!");

            case 5:
              user.isActivated = true;
              _context2.next = 8;
              return regeneratorRuntime.awrap(user.save());

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "login",
    value: function login(email, password, host) {
      var user, isPassEquals, confirm, decline, mail, msg, userDto, tokens;
      return regeneratorRuntime.async(function login$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              _context3.next = 3;
              return regeneratorRuntime.awrap(UserModel.findOne({
                email: email
              }));

            case 3:
              user = _context3.sent;

              if (user) {
                _context3.next = 6;
                break;
              }

              throw ApiError.Forbidden("User with email ".concat(email, " not found!"));

            case 6:
              _context3.next = 8;
              return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

            case 8:
              isPassEquals = _context3.sent;

              if (isPassEquals) {
                _context3.next = 11;
                break;
              }

              throw ApiError.Forbidden("Wrong password!");

            case 11:
              if (user.isActivated) {
                _context3.next = 13;
                break;
              }

              throw ApiError.Forbidden("Not activated account!");

            case 13:
              if (!(user.host.length && !user.host.includes(host))) {
                _context3.next = 23;
                break;
              }

              user.tmpHost = host;
              _context3.next = 17;
              return regeneratorRuntime.awrap(user.save());

            case 17:
              confirm = jwt.sign("".concat(email, "-confirm"), process.env.CONFIRM_HOST_SECRET);
              decline = jwt.sign("".concat(email, "-decline"), process.env.CONFIRM_HOST_SECRET);
              mail = checkNewHostEmail("".concat(process.env.API_URL, "/api/users/confirm-new-host/").concat(confirm), "".concat(process.env.API_URL, "/api/users/confirm-new-host/").concat(decline));
              msg = {
                to: email,
                from: "maintenance.questify@gmail.com",
                subject: "New IP!",
                text: "We detected autorize in your account from new IP. <a href=\"".concat(process.env.API_URL, "/api/users/confirm-new-host/").concat(confirm, "\">It was Me!</a> or <a href=\"").concat(process.env.API_URL, "/api/users/confirm-new-host/").concat(decline, "\">I didn't autorize, logout and change password!</a>"),
                html: mail
              };
              _context3.next = 23;
              return regeneratorRuntime.awrap(sgMail.send(msg));

            case 23:
              userDto = new UserDto(user);
              tokens = tokenService.generateTokens(_objectSpread({}, userDto));
              console.log("tokens", tokens);
              _context3.next = 28;
              return regeneratorRuntime.awrap(tokenService.saveToken(userDto.id, tokens.refreshToken));

            case 28:
              return _context3.abrupt("return", _objectSpread({}, tokens, {
                user: userDto
              }));

            case 29:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "logout",
    value: function logout(refreshToken) {
      var token;
      return regeneratorRuntime.async(function logout$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(tokenService.removeToken(refreshToken));

            case 2:
              token = _context4.sent;
              return _context4.abrupt("return", token);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "refresh",
    value: function refresh(refreshToken) {
      var userData, tokenFromDb, user, userDto, tokens;
      return regeneratorRuntime.async(function refresh$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log("refreshToken", refreshToken);

              if (refreshToken) {
                _context5.next = 3;
                break;
              }

              throw ApiError.UnauthorizedError();

            case 3:
              userData = tokenService.validateRefreshToken(refreshToken);
              _context5.next = 6;
              return regeneratorRuntime.awrap(tokenService.findToken(refreshToken));

            case 6:
              tokenFromDb = _context5.sent;

              if (!(!userData || !tokenFromDb)) {
                _context5.next = 9;
                break;
              }

              throw ApiError.UnauthorizedError();

            case 9:
              _context5.next = 11;
              return regeneratorRuntime.awrap(UserModel.findById(userData.id));

            case 11:
              user = _context5.sent;
              userDto = new UserDto(user);
              tokens = tokenService.generateTokens(_objectSpread({}, userDto));
              _context5.next = 16;
              return regeneratorRuntime.awrap(tokenService.saveToken(userDto.id, tokens.refreshToken));

            case 16:
              return _context5.abrupt("return", _objectSpread({}, tokens, {
                user: userDto
              }));

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "resetPasswordRequest",
    value: function resetPasswordRequest(email) {
      var user, resetLink, mail, msg;
      return regeneratorRuntime.async(function resetPasswordRequest$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              _context6.next = 3;
              return regeneratorRuntime.awrap(UserModel.findOne({
                email: email
              }));

            case 3:
              user = _context6.sent;

              if (user) {
                _context6.next = 6;
                break;
              }

              throw ApiError.BadRequest("User with email: ".concat(email, " not found!"));

            case 6:
              resetLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

              user.resetLink = resetLink;
              _context6.next = 10;
              return regeneratorRuntime.awrap(user.save());

            case 10:
              mail = forgotPasswordEmail("".concat(process.env.CLIENT_URL, "/api/users/change-password/").concat(resetLink), user.name);
              msg = {
                to: email,
                from: "maintenance.questify@gmail.com",
                subject: "Reset Password!",
                text: "Here is Your verification link - ".concat(process.env.CLIENT_URL, "/api/users/change-password/").concat(resetLink),
                html: mail
              };
              _context6.next = 14;
              return regeneratorRuntime.awrap(sgMail.send(msg));

            case 14:
              return _context6.abrupt("return", resetLink);

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "changePassword",
    value: function changePassword(password, resetLink) {
      var user, hashPassword;
      return regeneratorRuntime.async(function changePassword$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(UserModel.findOne({
                resetLink: resetLink
              }));

            case 2:
              user = _context7.sent;

              if (user) {
                _context7.next = 5;
                break;
              }

              throw ApiError.BadRequest("User not found!");

            case 5:
              _context7.next = 7;
              return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

            case 7:
              hashPassword = _context7.sent;
              user.password = hashPassword;
              user.resetLink = null;
              _context7.next = 12;
              return regeneratorRuntime.awrap(user.save());

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "confirmNewHost",
    value: function confirmNewHost(link) {
      var confirmation, email, answer, user, tokenFromDB, resetLink;
      return regeneratorRuntime.async(function confirmNewHost$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              confirmation = jwt.decode(link, process.env.AGREE_SECRET);
              email = confirmation.split("-")[0];
              answer = confirmation.split("-")[1];
              console.log("email", email);
              _context8.next = 6;
              return regeneratorRuntime.awrap(UserModel.findOne({
                email: email
              }));

            case 6:
              user = _context8.sent;
              console.log("user", user);

              if (!(answer === "decline")) {
                _context8.next = 26;
                break;
              }

              console.log("user.id", user.id);
              _context8.next = 12;
              return regeneratorRuntime.awrap(TokenModel.findOne({
                user: user.id
              }));

            case 12:
              tokenFromDB = _context8.sent;
              console.log("fitokenFromDBrst", tokenFromDB);

              if (!tokenFromDB) {
                _context8.next = 19;
                break;
              }

              _context8.next = 17;
              return regeneratorRuntime.awrap(this.logout(tokenFromDB.refreshToken));

            case 17:
              _context8.next = 20;
              break;

            case 19:
              false;

            case 20:
              user.tmpHost = null;
              resetLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

              user.resetLink = resetLink;
              _context8.next = 25;
              return regeneratorRuntime.awrap(user.save());

            case 25:
              return _context8.abrupt("return", resetLink);

            case 26:
              user.host.push(user.tmpHost);
              user.tmpHost = null;
              user.save();
              return _context8.abrupt("return", null);

            case 30:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }]);

  return UserService;
}();

module.exports = new UserService();