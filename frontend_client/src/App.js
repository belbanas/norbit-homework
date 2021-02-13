import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import GeoJSON from "ol/format/GeoJSON";
import MapComponent from "./components/MapComponent";

const ENDPOINT = "ws://localhost:3000";
let saving = false;

function App() {
    const [response, setResponse] = useState({});
    const [features, setFeatures] = useState({});

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("broadcast", (data) => {
            let GEOjson = {
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
            const wktOptions = {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
            };
            const parsedFeatures = new GeoJSON().readFeatures(
                GEOjson,
                wktOptions
            );
            setResponse(data);
            setFeatures(parsedFeatures);
            console.log(saving);
            if (saving) {
                socket.emit("save", data);
            }
        });
    }, []);

    const startBtnHandler = () => {
        console.log("START RECORDING");
        saving = true;
    };

    const stopBtnHandler = () => {
        console.log("STOP RECORDING");
        saving = false;
    };

    return (
        <div className="App">
            <div className="coordinates-label">
                Current coordinates: Latitude: {response.lat}, Longitude:{" "}
                {response.lon}, Heading: {response.heading}
            </div>
            <MapComponent features={features} />
            <div className="record-coord-label">
                <button onClick={startBtnHandler}>Start recording</button>
                <button onClick={stopBtnHandler}>Stop recording</button>
            </div>
        </div>
    );
}

export default App;
