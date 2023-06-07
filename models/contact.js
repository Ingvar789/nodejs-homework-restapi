const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../helpers");
const Joi = require("joi");

const contactSchemaJoi = Joi.object({
  name: Joi.string().required().messages({'any.required':`missing required name field`}),
  email: Joi.string().required().messages({'any.required':`missing required email field`}),
  phone: Joi.any().required().messages({'any.required':`missing required phone field`}),
  favorite: Joi.boolean(),
})

const updateFavoriteSchemaJoi = Joi.object({
  favorite: Joi.boolean().required(),
})

const joiSchemas = {
  contactSchemaJoi,
  updateFavoriteSchemaJoi,
}
const contactSchemaMongoose = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set email for contact'],
  },
  phone: {
    type: String,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey: false, timestamps: true});

const Contact = model("contact", contactSchemaMongoose);

contactSchemaMongoose.post("save", handleMongooseError);

module.exports = {
  Contact,
  joiSchemas,
}
