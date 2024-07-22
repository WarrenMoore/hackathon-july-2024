document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const qrCodeContainer = document.getElementById("qrcode");
  const qrCodeContainer2 = document.getElementById("qrcode2");
  const circle1 = document.getElementById("circle1");
  const circle2 = document.getElementById("circle2");

  if (!qrCodeContainer) {
    console.error("QR code container element not found");
    return;
  }
  if (!qrCodeContainer2) {
    console.error("QR code container2 element not found");
    return;
  }
  if (!circle1) {
    console.error("Circle1 element not found");
    return;
  }
  if (!circle2) {
    console.error("Circle2 element not found");
    return;
  }

  console.log("Creating QR Codes...");
  const qrCode1 = new QRCode(qrCodeContainer, {
    text: "http://172.16.101.78:8081/phone1.html",
    width: 400,
    height: 400,
  });

  const qrCode2 = new QRCode(qrCodeContainer2, {
    text: "http://172.16.101.78:8081/phone2.html",
    width: 400,
    height: 400,
  });

  // Initially hide the circles
  circle1.style.display = "none";
  circle2.style.display = "none";
  qrCodeContainer2.style.display = "none";

  const socket = new WebSocket("ws://172.16.101.78:8080");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    //console.log("Message received from server:", event.data);

    try {
      const message = JSON.parse(event.data);

      if (message.command === "phoneConnected" && message.player === 1) {
        qrCodeContainer.style.display = "none";
        qrCodeContainer2.style.display = "block";
      }

      if (message.command === "phoneConnected" && message.player === 2) {
        qrCodeContainer2.style.display = "none";
        circle1.style.display = "block";
        circle2.style.display = "block";
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };
});
