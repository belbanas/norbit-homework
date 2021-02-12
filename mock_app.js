const io = require("socket.io-client");
const socket = io("ws://localhost:3000");
const CSVToJson = require("csvtojson");

const filename = "line1.csv";

socket.on("connect", () => {
    socket.emit("message", "Starting broadcast coordinates...");
    CSVToJson()
        .fromFile(filename)
        .then((coords) => {
            let i = 0;
            const interval = setInterval(() => {
                socket.emit("coordinates", JSON.stringify(coords[i]));
                i++;
                if (i >= coords.length) {
                    clearInterval(interval);
                    socket.emit("message", "End of coordinates");
                }
            }, 1000);
        });
    socket.on("broadcast", (msg) => {
        console.log(msg);
    });
});

