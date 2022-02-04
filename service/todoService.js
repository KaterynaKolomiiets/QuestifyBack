/* ----------------- Todos DB Handling ------------------ */

const { Todo } = require("../models/todoModel");

async function getActive(data) {
  try {
    const result = await Todo.find({ data }); /* .populate("owner") */
    console.log("Getting Active todos...");
    return result;
  } catch (error) {
    console.log("Getting Active todos ERROR: ", error);
  }
}

async function getCompleted(data) {
  try {
    const result = await Todo.find({ data }); /* .populate("owner") */
    console.log("Getting Completed todos...");
    return result;
  } catch (error) {
    console.log("Getting Completed todos ERROR: ", error);
  }
}

async function add(data) {
  try {
    const result = await Todo.create(data);
    console.log("Creating new todo...");
    return result;
  } catch (error) {
    console.log("Creating new todo ERROR: ", error);
  }
}

async function update(id, owner, todo) {
  try {
    const result = await Todo.findOneAndUpdate({ _id: id, owner }, { $set: todo }, { new: true });
    console.log("Updating by ID...");
    return result;
  } catch (error) {
    console.log("Updating by ID ERROR: ", error);
  }
}

async function remove(id, owner) {
  try {
    const result = await Todo.findOneAndRemove({ _id: id, owner });
    console.log("Removing by ID...");
    return result;
  } catch (error) {
    console.log("Removing by ID ERROR: ", error);
  }
}

async function updateStatus(id, owner, isActive) {
  try {
    const result = await Todo.findOneAndUpdate({ _id: id, owner }, { $set: isActive }, { new: true });
    console.log("IsActive status updating...");
    return result;
  } catch (error) {
    console.log("IsActive status updating ERROR: ", error);
  }
}

module.exports = {
  getActive,
  getCompleted,
  add,
  update,
  updateStatus,
  remove,
};
