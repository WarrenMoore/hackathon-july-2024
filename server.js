const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

let player1Connected = false;
let player2Connected = false;

server.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("message", (message) => {
    const messageString = message.toString("utf8");
    console.log("Received:", messageString);

    try {
      const parsedMessage = JSON.parse(messageString);

      if (parsedMessage.command === "phoneConnected") {
        if (!player1Connected) {
          player1Connected = true;
          socket.player = 1;
          console.log("Player 1 connected");
        } else if (!player2Connected) {
          player2Connected = true;
          socket.player = 2;
          console.log("Player 2 connected");
        } else {
          console.log("More than 2 players are not supported");
        }
      }

      parsedMessage.player = socket.player;

      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    if (socket.player === 1) {
      player1Connected = false;
    } else if (socket.player === 2) {
      player2Connected = false;
    }
  });
});

console.log("WebSocket server is running on ws://172.16.101.78:8080");
