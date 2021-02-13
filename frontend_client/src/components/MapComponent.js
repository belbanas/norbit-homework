import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";

function MapComponent(props) {
    const [map, setMap] = useState();
    const [featuresLayer, setFeaturesLayer] = useState();

    const mapElement = useRef();

    useEffect(() => {
        const initialFeaturesLayer = new VectorLayer({
            source: new VectorSource(),
        });

        const initialMap = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                initialFeaturesLayer,
            ],
            view: new View({
                projection: "EPSG:3857",
                center: [0, 0],
                zoom: 0,
            }),
            controls: [],
        });

        setMap(initialMap);
        setFeaturesLayer(initialFeaturesLayer);
    }, []);

    useEffect(() => {
        if (props.features.length) {
            featuresLayer.setSource(
                new VectorSource({
                    features: props.features,
                })
            );
        }
    }, [props.features, featuresLayer]);

    return (
        <React.Fragment>
            <div ref={mapElement} className="map-container"></div>
        </React.Fragment>
    );
}

export default MapComponent;
