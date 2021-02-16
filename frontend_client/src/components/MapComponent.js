import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Style, Stroke, RegularShape, Fill } from "ol/style";

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
            featuresLayer.setStyle(
                new Style({
                    stroke: new Stroke({
                        color: "red",
                        width: 2,
                    }),
                    image: new RegularShape({
                        fill: new Fill({
                            color: "#fff",
                        }),
                        stroke: new Stroke({
                            color: "black",
                            width: 1,
                        }),
                        points: 3,
                        radius: 10,
                        rotation: (props.heading * Math.PI) / 180,
                    }),
                })
            );
            map.getView().fit(
                featuresLayer.getSource().getFeatures()[0].getGeometry(),
                { padding: [100, 100, 100, 100], minResolution: 0.2 }
            );
        }
    }, [props.features, featuresLayer, map]);

    return (
        <React.Fragment>
            <div ref={mapElement} className="map-container"></div>
        </React.Fragment>
    );
}

export default MapComponent;
