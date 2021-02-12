const express = require("express");
const app = express();
const server = require("http").createServer(app);
// const WebSocket = require("ws");

// const wss = new WebSocket.Server({ server: server });

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("A new client connected.");

    
    socket.on("message", (msg) => {
        io.emit("message2", "Hello2");
        console.log(msg);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// wss.on("connection", (ws) => {
//     console.log("A new client connected.");
//     ws.send("SERVER: Welcome new client!");

//     ws.on("message", (data) => {
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(data);
//             }
//         });
//     });
// });

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
