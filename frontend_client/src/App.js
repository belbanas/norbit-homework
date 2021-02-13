import './App.css';
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import GeoJSON from "ol/format/GeoJSON";
import MapComponent from "./components/MapComponent";

const ENDPOINT = "ws://localhost:3000";

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
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            };
            const parsedFeatures = new GeoJSON().readFeatures(GEOjson, wktOptions)
            setResponse(data);
            setFeatures(parsedFeatures);
        });
    }, []);

    return (
        <div className="App">
            <div className="coordinates-label">
                Current coordinates: Latitude: {response.lat}, Longitude:{" "}
                {response.lon}, Heading: {response.heading}
            </div>
            <MapComponent features={features}/>
            <div className="record-coord-label">
                <button>Start recording</button>
                <button>Stop recording</button>
            </div>
        </div>
    );
}

export default App;
