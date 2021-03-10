const WebSocket = require("ws");

const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

const sendMessage = (message) => {
  console.log(messages);
  messages.push(message);
  sendMessages();
};

const webChat = {
  sendMessage,
  wsConnection,
};

module.exports = webChat;
