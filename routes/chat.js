var express = require("express");
var router = express.Router();
var chat = require("../models/chat.schema");
const webChat = require("../wslib");
/* GET home page. */
router.get("/api/messages", function (req, res, next) {
  res.send(chat.getMessages());
});

router.get("/api/messages/:ts", function (req, res, next) {
  const ts = req.params.ts;
  const result = chat.getMessage(ts);
  if (result) res.send(result);
  else {
    res.statusCode = 404;
    res.send("no se encontro el mensaje buscado");
  }
});

router.post("/api/messages", function (req, res, next) {
  const msg = req.body;
  const { error, value } = chat.validateMessage(msg);
  if (!error) {
    chat.saveMessage(value);
    webChat.sendMessage(msg);
    res.send(value);
  } else {
    console.log(error);
    res.send("Mensaje invalido");
  }
});

router.put("/api/messages/:ts", function (req, res, next) {
  const ts = req.params.ts;
  const msg = req.body;
  const { error, value } = chat.validateMessage({ ...msg, ts: ts });
  if (!error) {
    const result = chat.updateMessage(value, ts);
    if (result) res.send(result);
    else {
      res.statusCode = 404;
      res.send("no se encontro el mensaje a actualizar");
    }
  } else {
    res.send("Mensaje invalido");
  }
});

router.delete("/api/messages/:ts", function (req, res, next) {
  const ts = req.params.ts;
  const result = chat.deleteMessage(ts);
  if (result) res.send(result);
  else {
    res.statusCode = 404;
    res.send("no se encontro el mensaje a eliminar");
  }
});

module.exports = router;
