const io = require("socket.io-client");
const socket = io("ws://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to the server");
    socket.emit("message", "Test Client Connected");
});

socket.on("broadcast", (msg) => {
    console.log(msg);
});
