"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../models/todoModel"),
    joiTodoSchema = _require.joiTodoSchema;

var services = require("../service/todoService");

function getAllTodos(req, res) {
  var owner = req.user.id;
  services.getAll({
    owner: owner
  }).then(function (result) {
    return res.status(200).json(result);
  });
}

function getActiveTodos(req, res) {
  var owner = req.user.id;
  services.getActive({
    owner: owner,
    isActive: "true"
  }).then(function (result) {
    return res.status(200).json(result);
  });
}

function getCompletedTodos(req, res) {
  var owner = req.user.id;
  services.getCompleted({
    owner: owner,
    isActive: "false"
  }).then(function (result) {
    return res.status(200).json(result);
  });
}

function addTodo(req, res) {
  var newTodo, _joiTodoSchema$valida, error, result;

  return regeneratorRuntime.async(function addTodo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newTodo = {
            title: req.body.title,
            category: req.body.category,
            type: req.body.type,
            time: req.body.time,
            //       isActive: req.body.isActive ? "true" : "false",
            level: req.body.level
          };
          _joiTodoSchema$valida = joiTodoSchema.validate(newTodo), error = _joiTodoSchema$valida.error;

          if (!error) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: error.details[0].message
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(services.add(_objectSpread({}, newTodo, {
            owner: req.user.id
          })));

        case 6:
          result = _context.sent;
          return _context.abrupt("return", res.status(201).json({
            result: result
          }));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}

function updateTodo(req, res) {
  var owner, id, todo, _joiTodoSchema$valida2, error, result;

  return regeneratorRuntime.async(function updateTodo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          owner = req.user.id;
          id = req.params.todoId;
          todo = {
            title: req.body.title,
            category: req.body.category,
            type: req.body.type,
            time: req.body.time,
            isActive: req.body.isActive ? true : false,
            level: req.body.level
          };
          _joiTodoSchema$valida2 = joiTodoSchema.validate(todo), error = _joiTodoSchema$valida2.error;

          if (!error) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: error.details[0].message
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(services.update(id, owner, _objectSpread({}, todo, {
            owner: owner
          })));

        case 8:
          result = _context2.sent;
          return _context2.abrupt("return", result ? res.status(201).json({
            result: result
          }) : res.status(404).json({
            message: "Todo with id:".concat(id, " not found")
          }));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function setStatusTodo(req, res) {
  var owner, id, isActive, result;
  return regeneratorRuntime.async(function setStatusTodo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          owner = req.user.id;
          id = req.params.todoId;
          isActive = {
            isActive: req.body.isActive
          };

          if (!(typeof isActive.isActive !== "boolean")) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Missing field isActive"
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(services.updateStatus(id, owner, isActive));

        case 7:
          result = _context3.sent;
          return _context3.abrupt("return", result ? res.status(201).json({
            result: result
          }) : res.status(404).json({
            message: "Todo with id:".concat(id, " not found")
          }));

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function removeTodo(req, res) {
  var owner, id, removedTodoById;
  return regeneratorRuntime.async(function removeTodo$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          owner = req.user.id;
          id = req.params.todoId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(services.remove(id, owner));

        case 4:
          removedTodoById = _context4.sent;
          return _context4.abrupt("return", removedTodoById ? res.status(200).json({
            message: "Todo with id:".concat(id, " removed successfully.")
          }) : res.status(404).json({
            message: "Todo with id:".concat(id, " not found.")
          }));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}

module.exports = {
  getAllTodos: getAllTodos,
  getActiveTodos: getActiveTodos,
  getCompletedTodos: getCompletedTodos,
  addTodo: addTodo,
  updateTodo: updateTodo,
  setStatusTodo: setStatusTodo,
  removeTodo: removeTodo
};