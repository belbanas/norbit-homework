const WebSocket = require("ws");
const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
    socket.send("Test client connected");
})

socket.addEventListener("message", (event) => {
    console.log(event.data);
})