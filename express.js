const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("A new client connected.");

    socket.on("message", (message) => {
        io.sockets.emit("broadcast", message);
        console.log(message);
    })
    
    socket.on("coordinates", (data) => {
        socket.broadcast.emit("broadcast", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
