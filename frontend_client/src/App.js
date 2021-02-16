import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import GeoJSON from "ol/format/GeoJSON";
import MapComponent from "./components/MapComponent";
import TracksComponent from "./components/TracksComponent";

const ENDPOINT = "ws://localhost:3000";
let socket;

function App() {
    const [response, setResponse] = useState([]);
    const [features, setFeatures] = useState({});
    const [tracks, setTracks] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        socket = socketIOClient(ENDPOINT);
        socket.on("broadcast", (data, data2) => {
            const wktOptions = {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
            };
            const parsedFeatures = new GeoJSON().readFeatures(data, wktOptions);
            if (data.features[0].geometry.type === "LineString") {
                setResponse(
                    data.features[0].geometry.coordinates[
                        data.features[0].geometry.coordinates.length - 1
                    ]
                );
            } else {
                setResponse(data.features[0].geometry.coordinates);
            }
            setFeatures(parsedFeatures);
            setSaving(data2);
        });
        socket.on("tracks", (data) => {
            setTracks(data);
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

    const getPointsForTrack = (id) => {
        socket.emit("pointsForTrack", id);
    };

    const streamBtnHandler = () => {
        socket.emit("streaming");
    };

    return (
        <div className="App">
            <div className="coordinates-label">
                Current coordinates: Latitude: {response[0]}, Longitude:{" "}
                {response[1]}, Heading: {response[2]}
            </div>
            <MapComponent
                features={features}
                heading={response[2]}
                saving={saving}
            />
            <div className="record-coord-label">
                <button onClick={startBtnHandler}>Start recording</button>
                <button onClick={stopBtnHandler}>Stop recording</button>
                <button onClick={streamBtnHandler}>Stream ON/OFF</button>
            </div>
            <div className="tracks-label">
                <TracksComponent
                    tracks={tracks}
                    getPointsForTrack={getPointsForTrack}
                />
            </div>
        </div>
    );
}

export default App;
