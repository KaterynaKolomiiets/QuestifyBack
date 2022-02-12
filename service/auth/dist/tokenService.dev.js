"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var jwt = require("jsonwebtoken");

var tokenModel = require("../../models/auth/tokenModel");

var TokenService =
/*#__PURE__*/
function () {
  function TokenService() {
    _classCallCheck(this, TokenService);
  }

  _createClass(TokenService, [{
    key: "generateTokens",
    value: function generateTokens(payload) {
      var accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
      });
      var refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d"
      });
      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    }
  }, {
    key: "validateAccessToken",
    value: function validateAccessToken(token) {
      try {
        var userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
      } catch (e) {
        return null;
      }
    }
  }, {
    key: "validateRefreshToken",
    value: function validateRefreshToken(token) {
      try {
        var userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
      } catch (e) {
        return null;
      }
    }
  }, {
    key: "saveToken",
    value: function saveToken(userId, refreshToken) {
      var tokenData, token;
      return regeneratorRuntime.async(function saveToken$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(tokenModel.findOne({
                user: userId
              }));

            case 2:
              tokenData = _context.sent;

              if (!tokenData) {
                _context.next = 6;
                break;
              }

              tokenData.refreshToken = refreshToken;
              return _context.abrupt("return", tokenData.save());

            case 6:
              _context.next = 8;
              return regeneratorRuntime.awrap(tokenModel.create({
                user: userId,
                refreshToken: refreshToken
              }));

            case 8:
              token = _context.sent;
              return _context.abrupt("return", token);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "removeToken",
    value: function removeToken(refreshToken) {
      var tokenData;
      return regeneratorRuntime.async(function removeToken$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(tokenModel.deleteOne({
                refreshToken: refreshToken
              }));

            case 2:
              tokenData = _context2.sent;
              return _context2.abrupt("return", tokenData);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "findToken",
    value: function findToken(refreshToken) {
      var tokenData;
      return regeneratorRuntime.async(function findToken$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log("refreshToken", refreshToken);
              _context3.next = 3;
              return regeneratorRuntime.awrap(tokenModel.findOne({
                refreshToken: refreshToken
              }));

            case 3:
              tokenData = _context3.sent;
              console.log("tokenData", tokenData);
              return _context3.abrupt("return", tokenData);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return TokenService;
}();

module.exports = new TokenService();