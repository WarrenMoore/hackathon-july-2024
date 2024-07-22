const socket = new WebSocket("wss://warren-office.local.fxdigital.uk:8080");

const circle1 = document.getElementById("circle1");
const circle2 = document.getElementById("circle2");

if (!circle1) {
  console.error("Circle1 element not found");
}
if (!circle2) {
  console.error("Circle2 element not found");
}

const maxX = window.innerWidth - 50;
const maxY = window.innerHeight - 50;

let x1 = 0;
let y1 = maxY / 2;
let x2 = maxX;
let y2 = maxY / 2;

let initialAlpha1 = null;
let initialBeta1 = null;
let initialAlpha2 = null;
let initialBeta2 = null;

const threshold = 0.35;

socket.onopen = () => {
  console.log("WebSocket connection established");
};

socket.onmessage = (event) => {
  try {
    const data = event.data;
    const parsedData = JSON.parse(data);

    if (parsedData.command === "reset1") {
      x1 = 0;
      y1 = maxY / 2;
      initialAlpha1 = null;
      initialBeta1 = null;
      circle1.style.left = `${x1}px`;
      circle1.style.top = `${y1}px`;
      console.log("Circle1 reset to center");
      return;
    }

    if (parsedData.command === "reset2") {
      x2 = maxX;
      y2 = maxY / 2;
      initialAlpha2 = null;
      initialBeta2 = null;
      circle2.style.left = `${x2}px`;
      circle2.style.top = `${y2}px`;
      console.log("Circle2 reset to center");
      return;
    }

    const { player, alpha, beta } = parsedData;

    if (player) {
      if (player === 1) {
        if (initialAlpha1 === null || initialBeta1 === null) {
          initialAlpha1 = alpha;
          initialBeta1 = beta;
        }

        const adjustedAlpha = alpha - initialAlpha1;
        const adjustedBeta = beta - initialBeta1;

        const sensitivity = 0.75;

        // if (Math.abs(adjustedAlpha) > threshold) {
        //   x1 -= adjustedAlpha * sensitivity;
        // }

        if (Math.abs(adjustedBeta) > threshold) {
          y1 -= adjustedBeta * sensitivity;
        }

        // x1 = Math.max(0, Math.min(x1, maxX));
        y1 = Math.max(0, Math.min(y1, maxY));

        player1.y = y1;

        circle1.style.left = `${x1}px`;
        circle1.style.top = `${y1}px`;
      } else if (player === 2) {
        if (initialAlpha2 === null || initialBeta2 === null) {
          initialAlpha2 = alpha;
          initialBeta2 = beta;
        }

        const adjustedAlpha = alpha - initialAlpha2;
        const adjustedBeta = beta - initialBeta2;

        const sensitivity = 0.75;

        // if (Math.abs(adjustedAlpha) > threshold) {
        //   x2 -= adjustedAlpha * sensitivity;
        // }

        if (Math.abs(adjustedBeta) > threshold) {
          y2 -= adjustedBeta * sensitivity;
        }

        x2 = Math.max(0, Math.min(x2, maxX));
        y2 = Math.max(0, Math.min(y2, maxY));

        player2.y = y2;

        circle2.style.left = `${x2}px`;
        circle2.style.top = `${y2}px`;
      }
    } else {
      // ball = parsedData.ball;
      // particles = parsedData.particles;
      // if (parsedData.collided) {
      //   var audio = new Audio("ping.mp3");
      //   audio.play();
      // }
      // draw();
    }

    draw();
  } catch (error) {
    console.error("Error handling message:", error);
  }
};

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
};

function Player(x, y) {
  this.height = 50;
  this.width = 10;
  this.score = 0;
  this.x = x;
  this.y = y;
}

Player.prototype.getX = function () {
  return this.x;
};

Player.prototype.setX = function (x) {
  this.x = x;
};

Player.prototype.getY = function () {
  return this.y;
};

Player.prototype.setY = function (y) {
  this.y = y;
};

Player.prototype.getHeight = function () {
  return this.height;
};

Player.prototype.setHeight = function (height) {
  this.height = height;
};

Player.prototype.getWidth = function () {
  return this.width;
};

Player.prototype.setWidth = function (width) {
  this.width = width;
};

Player.prototype.getScore = function () {
  return this.score;
};

Player.prototype.setScore = function (score) {
  this.score = score;
};

Player.prototype.addScore = function () {
  this.score += 1;
};

var canvas = document.getElementById("mycanvas");
var context2D = canvas.getContext("2d");
var ball = null;
var player1 = new Player(0, (canvas.height - 50) / 2);
var player2 = new Player(canvas.width - 10, (canvas.height - 50) / 2);
var particles = [];
var player = null;
var headerheight = 0;

function draw() {
  context2D.clearRect(0, 0, canvas.width, canvas.height);

  //court
  var padding = 10;
  context2D.lineWidth = 1;
  context2D.strokeStyle = "white";

  context2D.beginPath();
  context2D.moveTo(player1.width + padding, padding);
  context2D.lineTo(canvas.width - player2.width - padding, padding);
  context2D.lineTo(
    canvas.width - player2.width - padding,
    canvas.height - padding
  );
  context2D.lineTo(player1.width + padding, canvas.height - padding);
  context2D.lineTo(player1.width + padding, padding);
  context2D.stroke();

  context2D.beginPath();
  context2D.lineWidth = 2;
  context2D.moveTo(canvas.width / 2 + padding / 2, padding);
  context2D.lineTo(canvas.width / 2 + padding / 2, canvas.height - padding);
  context2D.stroke();

  var quarter_left =
    player1.width +
    padding +
    Math.round(
      (canvas.width - (player1.width + player2.width + padding + padding)) / 4
    );
  var quarter_right =
    canvas.width -
    player2.width -
    padding -
    Math.round(
      (canvas.width - (player1.width + player2.width + padding + padding)) / 4
    );
  var eigth = Math.round((canvas.height - padding * 2) / 8); //used for horizontal side-out lines
  context2D.lineWidth = 1;

  context2D.beginPath();
  context2D.moveTo(quarter_left, canvas.height / 2 + padding / 2);
  context2D.lineTo(quarter_right, canvas.height / 2 + padding / 2);
  context2D.stroke();

  context2D.beginPath();
  context2D.moveTo(quarter_left, canvas.height - (padding + eigth));
  context2D.lineTo(quarter_left, padding + eigth);
  context2D.stroke();

  context2D.beginPath();
  context2D.moveTo(quarter_right, canvas.height - (padding + eigth));
  context2D.lineTo(quarter_right, padding + eigth);
  context2D.stroke();

  context2D.beginPath();
  context2D.moveTo(player1.width + padding, canvas.height - (eigth + padding));
  context2D.lineTo(
    canvas.width - player2.width - padding,
    canvas.height - (eigth + padding)
  );
  context2D.stroke();

  context2D.beginPath();
  context2D.moveTo(player1.width + padding, padding + eigth);
  context2D.lineTo(canvas.width - player2.width - padding, padding + eigth);
  context2D.stroke();

  //ball
  if (ball) {
    context2D.beginPath();
    context2D.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context2D.fillStyle = "#fff";
    context2D.fill();
    context2D.lineWidth = 1;
    context2D.strokeStyle = "#003300";
    context2D.stroke();
  }

  //player
  context2D.fillStyle = "white";
  context2D.fillRect(player1.x, player1.y, player1.width, player1.height);
  context2D.fillRect(player2.x, player2.y, player2.width, player2.height);

  //particles
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    if (particle != null) {
      context2D.fillRect(
        particle.x,
        particle.y,
        particle.radius,
        particle.radius
      );
    }
  }
}

draw();
