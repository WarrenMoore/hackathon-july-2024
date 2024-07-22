document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const qrCodeContainer = document.getElementById("qrcode");
  const circle = document.getElementById("circle");

  if (!qrCodeContainer) {
    console.error("QR code container element not found");
    return;
  }
  if (!circle) {
    console.error("Circle element not found");
    return;
  }

  console.log("Creating QR Code...");
  const qrCode = new QRCode(qrCodeContainer, {
    text: "http://172.16.101.78:8081/phone.html",
    width: 128,
    height: 128,
  });

  // Initially hide the circle
  circle.style.display = "none";

  const socket = new WebSocket("ws://172.16.101.78:8080");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    console.log("Message received from server:", event.data);

    // Parse message from server
    try {
      const message = JSON.parse(event.data);

      // Check if the message indicates the phone has connected
      if (message.command === "phoneConnected") {
        // Hide QR code and show circle
        qrCodeContainer.style.display = "none";
        circle.style.display = "block";
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };
});
