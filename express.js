const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
const sp = require("./save_procedures.js");
const views = require("./views.js");
const fs = require("fs");

let saving = false;
let streaming = true;

let geoJSONtemplate;
let filename = "./geoJSONtemplate.json";
try {
    const data = fs.readFileSync(filename, "utf8");
    geoJSONtemplate = JSON.parse(data);
} catch (e) {
    console.log(e);
}

async function getTrackList() {
    let res = await views.viewTracks();
    io.sockets.emit("tracks", res);
}

async function getPointsForTrack(socket, id) {
    let res = await views.getPointsForTrack(id);
    geoJSONtemplate.features[0].geometry.coordinates = [];
    geoJSONtemplate.features[0].properties.shape = "Line";
    geoJSONtemplate.features[0].geometry.type = "LineString";
    for (let coord of res) {
        geoJSONtemplate.features[0].geometry.coordinates.push([
            coord.longitude,
            coord.latitude,
            coord.heading,
        ]);
    }
    io.sockets.emit("broadcast", geoJSONtemplate, saving);
}

io.on("connection", (socket) => {
    console.log("A new client connected with id: " + socket.id);

    getTrackList();

    socket.on("message", (message) => {
        io.sockets.emit("broadcast", message);
        console.log(message);
    });

    socket.on("coordinates", (data) => {
        if (streaming) {
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
        }
        socket.broadcast.emit("broadcast", geoJSONtemplate, saving);
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
            getTrackList();
        }
    });

    socket.on("pointsForTrack", (id) => {
        getPointsForTrack(socket, id);
    });

    socket.on("streaming", () => {
        streaming = streaming === true ? false : true;
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
