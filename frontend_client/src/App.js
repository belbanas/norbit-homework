import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "ws://localhost:3000";

function App() {
    const [response, setResponse] = useState("");

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on('broadcast', (data) => {
            setResponse(data);
        })
    }, []);

    return <div className="App">
        Current coordinates: Latitude: {response.lat}, Longitude: {response.lon}, Heading: {response.heading}
        </div>;
}

export default App;
