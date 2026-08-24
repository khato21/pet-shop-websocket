import { WebSocketServer, WebSocket } from "ws";

const PORT = 3001;

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket: WebSocket) => {
  console.log("WebSocket client connected");

  socket.send(
    JSON.stringify({
      type: "CONNECTED",
      message: "WebSocket connection established",
    }),
  );

  socket.on("message", (message) => {
    console.log("Message received:", message.toString());

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
