const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const CSVToJson = require("csvtojson");

const wss = new WebSocket.Server({ server: server });

const filename = "line1.csv";

wss.on("connection", (ws) => {
    console.log("A new client connected.");
    ws.send("Welcome new client!");

    CSVToJson()
        .fromFile(filename)
        .then((coords) => {
            let i = 0;
            const interval = setInterval(() => {
                ws.send(JSON.stringify(coords[i]));
                i++;
                if (i >= coords.length) {
                    clearInterval(interval);
                    ws.send("End of coordinates");
                }
            }, 1000);
        });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
