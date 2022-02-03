const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const todoSchema = new Schema(
  {
    title: { type: String, required: [true, "Set name for ToDo(Quest) card"] },
    // ------------------------------
    // индексация для быстрого поиска
    // name: {type:String, index:1},
    // ------------------------------
    category: { type: String, enum: ["STUFF", "FAMILY", "HEALTH", "LEARNING", "LEISURE", "WORK"], default: "STUFF" },
    type: { type: String, enum: ["TASK", "CHALLENGE"], default: "TASK" },
    time: { type: Date },
    isActive: { type: Boolean, default: true }, // active / completed
    level: { type: String, enum: ["Easy", "Normal", "Hard"], default: "Easy" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const joiTodoSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я ]*$/)
    .min(2)
    .max(30)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[ ]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/)
    .required(),
  favorite: Joi.boolean().required(),
});

const Todo = mongoose.model("todos", contactSchema);

module.exports = { Todo, joiTodoSchema };
