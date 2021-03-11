const Joi = require("joi");
const Message = require("./message.model");

const messageSchema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().required(),
  ts: Joi.string(),
});

const saveMessage = async (msg) => {
  try {
    return await Message.create(msg);
  } catch (error) {
    console.log(error);
  }
};

const updateMessage = async (msg, ts) => {
  return await Message.update(msg, { where: { ts: ts } });
};

const getMessage = async (ts) => {
  return await Message.findOne({ where: { ts: ts } });
};

const getMessages = async () => {
  return await Message.findAll({ attributes: ["message", "ts", "author"] });
};

const deleteMessage = async (ts) => {
  return await Message.destroy({ where: { ts: ts } });
};

const validateMessage = (msg) => messageSchema.validate(msg);

const chat = {
  saveMessage,
  getMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  validateMessage,
};

module.exports = chat;
