const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
const sp = require("./save_procedures.js");
const fs = require("fs");

let saving = false;

let geoJSONtemplate;
let filename = "./geoJSONtemplate.json";
try {
    const data = fs.readFileSync(filename, "utf8");
    geoJSONtemplate = JSON.parse(data);
} catch (e) {
    console.log(e);
}

io.on("connection", (socket) => {
    console.log("A new client connected with id: " + socket.id);

    socket.on("message", (message) => {
        io.sockets.emit("broadcast", message);
        console.log(message);
    });

    socket.on("coordinates", (data) => {
        if (saving) {
            geoJSONtemplate.features[0].properties.shape = "Line";
            geoJSONtemplate.features[0].geometry.type = "LineString";
            geoJSONtemplate.features[0].geometry.coordinates.push([
                data.lon,
                data.lat,
                data.heading,
            ]);
            sp.saveCoordinate(data.lat, data.lon, data.heading);
        } else {
            geoJSONtemplate.features[0].properties.shape = "Marker";
            geoJSONtemplate.features[0].geometry.type = "Point";
            geoJSONtemplate.features[0].geometry.coordinates = [
                data.lon,
                data.lat,
                data.heading,
            ];
        }
        socket.broadcast.emit("broadcast", geoJSONtemplate);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("save", (bool) => {
        saving = bool;
        if (saving) {
            console.log("START SAVING COORDINATES");
            geoJSONtemplate.features[0].geometry.coordinates = [];
            sp.saveTrack(socket.id);
        } else {
            sp.updateTrackStopTime();
        }
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
