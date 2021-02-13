const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
const db = require("./db.js");

let saving = false;

let lineGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                shape: "Line",
                name: "Unnamed Layer",
                category: "default",
            },
            geometry: {
                type: "LineString",
                coordinates: [],
            },
        },
    ],
};

io.on("connection", (socket) => {
    console.log("A new client connected with id: " + socket.id);

    socket.on("message", (message) => {
        io.sockets.emit("broadcast", message);
        console.log(message);
    });

    socket.on("coordinates", (data) => {
        if (saving) {
            lineGeoJSON.features[0].geometry.coordinates.push([data.lon, data.lat, data.heading]);
            socket.broadcast.emit("broadcast", lineGeoJSON);
        } else {
            lineGeoJSON.features[0].geometry.coordinates = [];
            let geoJSON = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            shape: "Marker",
                            name: "Unnamed Layer",
                            category: "default",
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [data.lon, data.lat, data.heading],
                        },
                    },
                ],
            };
            socket.broadcast.emit("broadcast", geoJSON);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("save", (data) => {
        saving = data;
        if (saving) {
            console.log("SAVING COORDINATES");
        }
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
