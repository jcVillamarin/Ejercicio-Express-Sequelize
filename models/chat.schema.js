const fs = require("fs");

const Joi = require("joi");

const webChat = require("../wslib");
// [Joi.string(), Joi.number()]
// Joi.string().pattern(new RegExp("^[Aa-zA-Z0-9]{3,30}$"))
// .pattern(new RegExp("^[a-z ,.'-]+$/i"))
const chatSchema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().required(),
  ts: Joi.string().required(),
});

const writeFile = (data) => {
  data = JSON.stringify(data);
  try {
    fs.writeFileSync(`${__dirname}/../data/chat.json`, data);
    console.log("JSON data is saved.");
  } catch (error) {
    console.error(error);
  }
};

const readFile = () => {
  try {
    const data = fs.readFileSync(`${__dirname}/../data/chat.json`, "utf-8");
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = (msg) => {
  const data = readFile();
  data.messages.push(msg);
  writeFile(data);
  webChat.sendMessage(msg.message);
};

const updateMessage = (msg, ts) => {
  const data = readFile();
  const messages = data.messages;
  const index = messages.findIndex((message) => message.ts == ts);
  if (index !== -1) {
    messages[index] = { message: msg.message, author: msg.author, ts: ts };
    data.messages = messages;
    writeFile(data);
    return messages[index];
  } else {
    return null;
  }
};

const getMessage = (ts) => {
  const data = readFile();
  const messages = data.messages;
  return messages.find((message) => message.ts == ts);
};

const getMessages = () => {
  const data = readFile();
  return data.messages;
};

const deleteMessage = (ts) => {
  const data = readFile();
  const index = data.messages.findIndex((message) => message.ts == ts);
  if (index !== -1) {
    const deleted = data.messages[index];
    data.messages.splice(index, 1);
    writeFile(data);
    return deleted;
  } else {
    return null;
  }
};

const validateMessage = (msg) => chatSchema.validate(msg);

const chat = {
  saveMessage,
  getMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  validateMessage,
};

module.exports = chat;
