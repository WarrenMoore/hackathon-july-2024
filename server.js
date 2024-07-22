const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

let phoneConnected = false;

server.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("message", (message) => {
    const messageString = message.toString("utf8"); // Convert Buffer to string
    console.log("Received:", messageString);

    try {
      const parsedMessage = JSON.parse(messageString);

      if (parsedMessage.command === "phoneConnected") {
        phoneConnected = true;
        console.log("Phone connected");
      }

      // Broadcast the message to all clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          if (phoneConnected || parsedMessage.command !== "phoneConnected") {
            client.send(messageString);
          }
        }
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });
});

console.log("WebSocket server is running on ws://172.16.101.78:8080");
