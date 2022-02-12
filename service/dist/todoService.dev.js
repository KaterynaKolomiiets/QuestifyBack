"use strict";

/* ----------------- Todos DB Handling ------------------ */
var _require = require("../models/todoModel"),
    Todo = _require.Todo;

var apiError = require("../service/auth/apiError");

function getAll(data) {
  var result;
  return regeneratorRuntime.async(function getAll$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Todo.find(data));

        case 3:
          result = _context.sent;

          /* .populate("owner") */
          console.log("Getting All todos...");
          return _context.abrupt("return", result);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          throw apiError.BadRequest("Getting All todos ERROR: ", _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function getActive(data) {
  var result;
  return regeneratorRuntime.async(function getActive$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Todo.find(data));

        case 3:
          result = _context2.sent;

          /* .populate("owner") */
          console.log("Getting Active todos...");
          return _context2.abrupt("return", result);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          throw apiError.BadRequest("Getting Active todos ERROR: ", _context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function getCompleted(data) {
  var result;
  return regeneratorRuntime.async(function getCompleted$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log(data);
          _context3.next = 4;
          return regeneratorRuntime.awrap(Todo.find(data));

        case 4:
          result = _context3.sent;

          /* .populate("owner") */
          console.log("Getting Completed todos...");
          return _context3.abrupt("return", result);

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw apiError.BadRequest("Getting Completed todos ERROR: ", _context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

function add(data) {
  var result;
  return regeneratorRuntime.async(function add$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Todo.create(data));

        case 3:
          result = _context4.sent;
          console.log("Creating new todo...");
          return _context4.abrupt("return", result);

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          throw apiError.BadRequest("Creating new todo ERROR: ", _context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function update(id, owner, todo) {
  var result;
  return regeneratorRuntime.async(function update$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Todo.findOneAndUpdate({
            _id: id,
            owner: owner
          }, {
            $set: todo
          }, {
            "new": true
          }));

        case 3:
          result = _context5.sent;
          console.log("Updating by ID...");
          return _context5.abrupt("return", result);

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          throw apiError.BadRequest("Updating by ID ERROR: ", _context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function remove(id, owner) {
  var result;
  return regeneratorRuntime.async(function remove$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Todo.findOneAndRemove({
            _id: id,
            owner: owner
          }));

        case 3:
          result = _context6.sent;
          console.log("Removing by ID...");
          return _context6.abrupt("return", result);

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          throw apiError.BadRequest("Removing by ID ERROR: ", _context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function updateStatus(id, owner, isActive) {
  var result;
  return regeneratorRuntime.async(function updateStatus$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Todo.findOneAndUpdate({
            _id: id,
            owner: owner
          }, {
            $set: isActive
          }, {
            "new": true
          }));

        case 3:
          result = _context7.sent;
          console.log("IsActive status updating...");
          return _context7.abrupt("return", result);

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          throw apiError.BadRequest("IsActive status updating ERROR: ", _context7.t0);

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

module.exports = {
  getAll: getAll,
  getActive: getActive,
  getCompleted: getCompleted,
  add: add,
  update: update,
  updateStatus: updateStatus,
  remove: remove
};