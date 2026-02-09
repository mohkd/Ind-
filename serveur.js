import { WebSocketServer } from "ws";
import http from "http";

const PORT = process.env.PORT || 3000;

// Serveur HTTP (obligatoire pour Railway)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket server running 🚄");
});

// WebSocket attaché au serveur HTTP
const wss = new WebSocketServer({
  server,
  maxPayload: 1024 * 1024 * 10 // 10 MB par message
});

console.log("Starting WebSocket server...");

wss.on("connection", (ws, req) => {
  console.log("🟢 Client connecté", req.socket.remoteAddress);

  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data, isBinary) => {
    // ⚠️ data est un Buffer (rapide)
    // Évite JSON.parse si tu reçois énormément d’info
    console.log("📨 Message reçu:", isBinary ? "binary" : data.toString());

    // Exemple de réponse
    ws.send("reçu");
  });

  ws.on("close", () => {
    console.log("🔴 Client déconnecté");
  });

  ws.on("error", (err) => {
    console.error("❌ WS error:", err);
  });
});

// Heartbeat (important pour les connexions longues)
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => clearInterval(interval));

// Lancement serveur
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
