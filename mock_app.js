const WebSocket = require("ws");
const socket = new WebSocket("ws://localhost:3000");
const CSVToJson = require("csvtojson");

const filename = "line1.csv";

socket.addEventListener("open", (event) => {
    console.log("Connected to WS server");

    CSVToJson()
        .fromFile(filename)
        .then((coords) => {
            let i = 0;
            const interval = setInterval(() => {
                socket.send(JSON.stringify(coords[i]));
                i++;
                if (i >= coords.length) {
                    clearInterval(interval);
                    socket.send("End of coordinates");
                }
            }, 1000);
        });
});

socket.addEventListener("message", (event) => {
    console.log(event.data);
});
