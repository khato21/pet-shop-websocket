import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT) || 3001;

const wss = new WebSocketServer({ port: PORT });

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
}

const interval = setInterval(() => {
  wss.clients.forEach((ws: ExtendedWebSocket) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("connection", (socket: ExtendedWebSocket) => {
  socket.isAlive = true;

  socket.on("pong", () => {
    socket.isAlive = true;
  });

  socket.send(
    JSON.stringify({
      type: "CONNECTED",
      message: "WebSocket connection established",
    }),
  );

  socket.on("message", (rawMessage) => {
    const messageString = rawMessage.toString();

    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    }
  });

  socket.on("close", () => {});

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

wss.on("close", () => {
  clearInterval(interval);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
