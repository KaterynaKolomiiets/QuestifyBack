const { joiTodoSchema } = require("../models/todoModel");
const services = require("../service/todoService");

function getActiveTodos(req, res) {
  // const { _id: owner } = req.user;
  services.getActive({ /* owner, */ isActive: true }).then((result) => {
    return res.status(200).json(result);
  });
}

function getCompletedTodos(req, res) {
  // const { _id: owner } = req.user;
  services.getCompleted({ /* owner, */ isActive: false }).then((result) => {
    return res.status(200).json(result);
  });
}

async function addTodo(req, res) {
  try {
    const newTodo = {
      title: req.body.title,
      category: req.body.category,
      type: req.body.type,
      time: req.body.time,
      isActive: req.body.isActive ? true : false,
      level: req.body.level,
    };
    const { error } = joiTodoSchema.validate(newTodo);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // const result = await services.add({ ...newTodo, owner: req.user._id });
    const result = await services.add({ ...newTodo, owner: "req.user._id" });

    return res.status(201).json({ status: 201, message: "Created Successfully", result });
  } catch (error) {
    console.log("Add new todo error: ", error);
  }
}

async function updateTodo(req, res) {
  try {
    const { _id: owner } = req.user;
    const id = req.params.contactId;
    const contact = {
      title: req.body.title,
      category: req.body.category,
      type: req.body.type,
      time: req.body.time,
      isActive: req.body.isActive ? true : false,
      level: req.body.level,
    };
    const { error } = joiTodoSchema.validate(todo);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await services.update(id, owner, { ...contact, owner });

    return result
      ? res.status(201).json({ status: 201, message: "Updated Successfully", result })
      : res.status(404).json({ message: `Todo with id:${id} not found` });
  } catch (error) {
    console.log("Update Todo error: ", error);
  }
}

async function setStatusTodo(req, res) {
  try {
    const { _id: owner } = req.user;
    const id = req.params.todoId;
    const isActive = {
      isActive: req.body.isActive,
    };
    if (typeof isActive.isActive !== "boolean") {
      return res.status(400).json({ message: "Missing field isActive" });
    }
    const result = await services.updateStatus(id, owner, isActive);
    return result
      ? res.status(201).json({ status: 201, message: "Status Updated Successfully", result })
      : res.status(404).json({ message: `Todo with id:${id} not found` });
  } catch (error) {
    console.log("Update status error: ", error);
    return res.status(404).json({ message: "Not found" });
  }
}

async function removeTodo(req, res) {
  const { _id: owner } = req.user;
  const id = req.params.todoId;
  const removedTodoById = await services.remove(id, owner);
  return removedTodoById
    ? res.status(200).json({ message: `Todo with id:${id} removed successfully.` })
    : res.status(404).json({ message: `Todo with id:${id} not found.` });
}

module.exports = { getActiveTodos, getCompletedTodos, addTodo, updateTodo, setStatusTodo, removeTodo };