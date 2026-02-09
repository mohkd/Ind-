function startBroadcast(wss, interval) {
  setInterval(() => {
    const data = JSON.stringify({
      type: "heartbeat",
      timestamp: Date.now()
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });

  }, interval);
}

module.exports = startBroadcast;
