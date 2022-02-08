/* ----------------- Todos DB Handling ------------------ */

const { Todo } = require("../models/todoModel");
const apiError = require("../service/auth/apiError");

async function getAll(data) {
  try {
    const result = await Todo.find(data); /* .populate("owner") */
    console.log("Getting All todos...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Getting All todos ERROR: ", error);
  }
}
async function getActive(data) {
  try {
    const result = await Todo.find(data); /* .populate("owner") */
    console.log("Getting Active todos...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Getting Active todos ERROR: ", error);
  }
}

async function getCompleted(data) {
  try {
    console.log(data);
    const result = await Todo.find(data); /* .populate("owner") */
    console.log("Getting Completed todos...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Getting Completed todos ERROR: ", error);
  }
}

async function add(data) {
  try {
    const result = await Todo.create(data);
    console.log("Creating new todo...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Creating new todo ERROR: ", error);
  }
}

async function update(id, owner, todo) {
  try {
    const result = await Todo.findOneAndUpdate({ _id: id, owner }, { $set: todo }, { new: true });
    console.log("Updating by ID...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Updating by ID ERROR: ", error);
  }
}

async function remove(id, owner) {
  try {
    const result = await Todo.findOneAndRemove({ _id: id, owner });
    console.log("Removing by ID...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("Removing by ID ERROR: ", error);
  }
}

async function updateStatus(id, owner, isActive) {
  try {
    const result = await Todo.findOneAndUpdate({ _id: id, owner }, { $set: isActive }, { new: true });
    console.log("IsActive status updating...");
    return result;
  } catch (error) {
    throw apiError.BadRequest("IsActive status updating ERROR: ", error);
  }
}

module.exports = {
  getAll,
  getActive,
  getCompleted,
  add,
  update,
  updateStatus,
  remove,
};
