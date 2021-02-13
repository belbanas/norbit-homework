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
                zoom: 2,
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
            map.getView().fit(featuresLayer.getSource().getFeatures()[0].getGeometry(), {padding: [100, 100, 100, 100], minResolution: 0.5});
        }
    }, [props.features, featuresLayer, map]);

    return (
        <React.Fragment>
            <div ref={mapElement} className="map-container"></div>
        </React.Fragment>
    );
}

export default MapComponent;
