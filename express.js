const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("A new client connected with id: " + socket.id);

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

    socket.on("save", (data) => {
        console.log(data);
    })
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
