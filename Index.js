const express = require('express');
const WebSocket = require('ws');
const app = express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
});

const wss = new WebSocket.Server({ server });
let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`🟢 Bot connected | Total: ${clients.size}`);

  ws.on('message', (msg) => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`🔴 Bot disconnected | Total: ${clients.size}`);
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>🧠 Brainrot Scanner WebSocket</h1>
    <p>Connected Bots: <strong>${clients.size}</strong></p>
    <p>Status: ✅ ONLINE</p>
  `);
});
