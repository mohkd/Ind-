const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const { PORT, BROADCAST_INTERVAL } = require("./config");
const startBroadcast = require("./broadcaster");
const { initForwarder, forwardMessage } = require("./forwarder");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  clientTracking: true,
  perMessageDeflate: false
});

let clientCount = 0;

wss.on("connection", (ws) => {
  clientCount++;
  console.log("Client connected:", clientCount);

  ws.on("message", (message) => {
    // Broadcast vers tous sauf l’envoyeur
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(message.toString());
      }
    });

    // Forward si activé
    forwardMessage(message.toString());
  });

  ws.on("close", () => {
    clientCount--;
    console.log("Client disconnected:", clientCount);
  });
});

// Heartbeat automatique
startBroadcast(wss, BROADCAST_INTERVAL);

// Forward si activé
initForwarder();

app.get("/", (req, res) => {
  res.send("WebSocket server running on Railway!");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
