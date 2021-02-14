const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
const db = require("./db.js");

let saving = false;

let geoJSONtemplate = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                shape: "",
                name: "Unnamed Layer",
                category: "default",
            },
            geometry: {
                type: "",
                coordinates: [],
            },
        },
    ],
};

let lastId;

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
            db.query(
                "INSERT INTO coordinates(track_id, latitude, longitude, heading) VALUES($1, $2, $3, $4)",
                [lastId, data.lat, data.lon, data.heading],
                (err, res) => {
                    if (err) {
                        console.log("ERROR: " + err);
                    } else {
                        console.log("SAVED!");
                    }
                }
            );
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
            db.query(
                "INSERT INTO tracks(client_id) VALUES($1) RETURNING id",
                [socket.id],
                (err, res) => {
                    if (err) {
                        console.log("ERROR: " + err);
                    } else {
                        console.log("START OK");
                        lastId = res.rows[0].id;
                        console.log(lastId);
                    }
                }
            );
        } else {
            console.log(lastId);
            db.query(
                "UPDATE tracks SET stop_record = CURRENT_TIMESTAMP WHERE id = $1",
                [lastId],
                (err, res) => {
                    if (err) {
                        console.log("ERROR: " + err);
                    } else {
                        console.log("STOP OK");
                    }
                }
            );
        }
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
