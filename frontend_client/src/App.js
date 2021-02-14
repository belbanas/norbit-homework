import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import GeoJSON from "ol/format/GeoJSON";
import MapComponent from "./components/MapComponent";

const ENDPOINT = "ws://localhost:3000";
let socket;

function App() {
    const [response, setResponse] = useState([]);
    const [features, setFeatures] = useState({});

    useEffect(() => {
        socket = socketIOClient(ENDPOINT);
        socket.on("broadcast", (data) => {
            const wktOptions = {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
            };
            const parsedFeatures = new GeoJSON().readFeatures(data, wktOptions);
            setResponse(data.features[0].geometry.coordinates);
            setFeatures(parsedFeatures);
        });
        return () => socket.disconnect();
    }, []);

    const startBtnHandler = () => {
        socket.emit("save", true);
        console.log("START RECORDING");
    };

    const stopBtnHandler = () => {
        socket.emit("save", false);
        console.log("STOP RECORDING");
    };

    return (
        <div className="App">
            <div className="coordinates-label">
                Current coordinates: Latitude: {response[0]}, Longitude:{" "}
                {response[1]}, Heading: {response[2]}
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
