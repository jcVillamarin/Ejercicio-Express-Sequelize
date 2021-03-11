const WebSocket = require("ws");
const chat = require("./models/chat.schema");

const clients = [];
let messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", async (data) => {
      try {
        data = JSON.parse(data);
        const resutl = await chat.saveMessage({ ...data, ts: Date.now() });
        if (!resutl) return;
        messages = await chat.getMessages();
        sendMessages();
      } catch (error) {
        console.log(error);
      }
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

const sendMessage = (message) => {
  console.log(message);
  messages.push(message);
  sendMessages();
};

const webChat = {
  sendMessage,
  wsConnection,
};

module.exports = webChat;
