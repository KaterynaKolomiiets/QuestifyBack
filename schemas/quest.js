const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const contactSchema = new Schema(
  {
    name: { type: String, required: [true, "Set name for contact"] },
    // ------------------------------
    // индексация для быстрого поиска
    // name: {type:String, index:1},
    // ------------------------------
    email: { type: String },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const joiContactsSchema = Joi.object({
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

const Contact = mongoose.model("contacts", contactSchema);

module.exports = { Contact, joiContactsSchema };
