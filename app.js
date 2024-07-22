const socket = new WebSocket("ws://172.16.101.78:8080");

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

let x1 = maxX / 2;
let y1 = maxY / 2;
let x2 = maxX / 2;
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
      x1 = maxX / 2;
      y1 = maxY / 2;
      initialAlpha1 = null;
      initialBeta1 = null;
      circle1.style.left = `${x1}px`;
      circle1.style.top = `${y1}px`;
      console.log("Circle1 reset to center");
      return;
    }

    if (parsedData.command === "reset2") {
      x2 = maxX / 2;
      y2 = maxY / 2;
      initialAlpha2 = null;
      initialBeta2 = null;
      circle2.style.left = `${x2}px`;
      circle2.style.top = `${y2}px`;
      console.log("Circle2 reset to center");
      return;
    }

    const { player, alpha, beta } = parsedData;

    if (player === 1) {
      if (initialAlpha1 === null || initialBeta1 === null) {
        initialAlpha1 = alpha;
        initialBeta1 = beta;
      }

      const adjustedAlpha = alpha - initialAlpha1;
      const adjustedBeta = beta - initialBeta1;

      const sensitivity = 0.75;

      if (Math.abs(adjustedAlpha) > threshold) {
        x1 -= adjustedAlpha * sensitivity;
      }

      if (Math.abs(adjustedBeta) > threshold) {
        y1 -= adjustedBeta * sensitivity;
      }

      x1 = Math.max(0, Math.min(x1, maxX));
      y1 = Math.max(0, Math.min(y1, maxY));

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

      if (Math.abs(adjustedAlpha) > threshold) {
        x2 -= adjustedAlpha * sensitivity;
      }

      if (Math.abs(adjustedBeta) > threshold) {
        y2 -= adjustedBeta * sensitivity;
      }

      x2 = Math.max(0, Math.min(x2, maxX));
      y2 = Math.max(0, Math.min(y2, maxY));

      circle2.style.left = `${x2}px`;
      circle2.style.top = `${y2}px`;
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
};
