const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");

var Ball = require("./gamelogic/Ball");
var Particle = require("./gamelogic/Particle");
var Player = require("./gamelogic/Player");
var Logic = require("./gamelogic/Logic");

var sockets = [];

const _server = https.createServer({
  cert: fs.readFileSync(".ssh/__local_fxdigital_uk.crt"),
  key: fs.readFileSync(".ssh/key.key"),
});
const server = new WebSocket.Server({ server: _server });
_server.listen(8080);

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

          // var logic = new Logic(false);
          // logic.init();

          // var gameloop = setInterval(function () {
          //   if (!logic.isOnPause()) {
          //     var ok = logic.calculate();

          //     if (logic.hasWon()) {
          //       //reached maxScore
          //       logic.pause();
          //       //                cancel(sockets[1]);
          //     }

          //     if (!ok) {
          //       console.log("Game end");
          //       logic.pause();
          //       //            clearInterval(gameloop);
          //       //            clearInterval(ballloop);
          //       setTimeout(function () {
          //         //a(sockets, logic);
          //         logic.unpause();
          //         logic.init();
          //         //                    b(sockets, logic);
          //         //                    for (var i = 0, max = pairs.length; i < max; i++) {
          //         //                        if (pairs[i].p1 == sockets[0].id || pairs[i].p2 == sockets[1].id) {
          //         //                            pairs[i].loops = loops;
          //         //                            console.log('Updated loops');
          //         //                            break;
          //         //                        }
          //         //                    }
          //       }, 3000);
          //     }
          //     server.clients.forEach((client) => {
          //       client.send(
          //         JSON.stringify({
          //           player1: logic.getPlayer1(),
          //           player2: logic.getPlayer2(),
          //           ball: logic.getBall(),
          //           collided: logic.isCollided(),
          //           particles: logic.getParticles(),
          //         })
          //       );
          //     });
          //   }
          // }, 33);

          // var ballloop = setInterval(function () {
          //   logic.increaseBallSpeed();
          //   console.log("Ballspeed: " + logic.getBall().getVx());
          // }, 10000);
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

console.log(
  "WebSocket server is running on wss://warren-office.local.fxdigital.uk:8080"
);
