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
            console.log(parsedFeatures);
            setResponse(data);
            setFeatures(parsedFeatures);
        });
    }, []);

    return (
        <div className="App">
            {JSON.stringify(features)}
            Current coordinates: Latitude: {response.lat}, Longitude:{" "}
            {response.lon}, Heading: {response.heading}
            <MapComponent features={features}/>
            <div id="map"></div>
        </div>
    );
}

export default App;
