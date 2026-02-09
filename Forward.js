const WebSocket = require("ws");
const { FORWARD_URL } = require("./config");

let forwardSocket = null;

function initForwarder() {
  if (!FORWARD_URL) return;

  forwardSocket = new WebSocket(FORWARD_URL);

  forwardSocket.on("open", () => console.log("Connected to forward server"));

  forwardSocket.on("close", () => {
    console.log("Forward connection closed, reconnecting in 3s...");
    setTimeout(initForwarder, 3000);
  });
}

function forwardMessage(message) {
  if (forwardSocket && forwardSocket.readyState === 1) {
    forwardSocket.send(message);
  }
}

module.exports = {
  initForwarder,
  forwardMessage
};
