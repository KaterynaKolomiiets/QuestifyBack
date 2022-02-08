const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const todoSchema = new Schema(
  {
    title: { type: String, required: [true, "Set name for ToDo(Quest) card"] },
    // ------------------------------
    // индексация для быстрого поиска
    // name: {type:String, index:1}
    // ------------------------------
    category: { type: String, enum: ["STUFF", "FAMILY", "HEALTH", "LEARNING", "LEISURE", "WORK"], default: "STUFF" },
    type: { type: String, enum: ["TASK", "CHALLENGE"], default: "TASK" },
    time: { type: Date },
    isActive: { type: Boolean, default: true }, // active / completed
    level: { type: String, enum: ["Easy", "Normal", "Hard"], default: "Easy" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { versionKey: false, timestamps: true }
);

const joiTodoSchema = Joi.object({
  title: Joi.string()
    .regex(/^[a-zA-Zа-яА-Яіїє' ]*$/)
    .min(2)
    .max(30)
    .required(),
  category: Joi.string().required(),
  type: Joi.string().required(),
  time: Joi.date().required(),
  isActive: Joi.boolean(),
  level: Joi.string().required(),
});

const Todo = mongoose.model("todos", todoSchema);

module.exports = { Todo, joiTodoSchema };
