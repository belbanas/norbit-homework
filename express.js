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
            geoJSONtemplate.features[0].geometry.coordinates.push([data.lon, data.lat, data.heading]);
        } else {
            geoJSONtemplate.features[0].properties.shape = "Marker";
            geoJSONtemplate.features[0].geometry.type = "Point";
            geoJSONtemplate.features[0].geometry.coordinates = [data.lon, data.lat, data.heading];
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
        }
    });
});

app.get("/", (req, res) => {
    res.send("My http server is running.");
});

server.listen(3000, () => {
    console.log("The app is listening on port 3000.");
});
