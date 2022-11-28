import geoJson from "@/constants/blue.json";
import { generateLineFromPoints } from "@/utils/geoJson";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    Layer,
    LayerProps,
    Marker,
    NavigationControl,
    Source,
} from "react-map-gl";

const circularStopLayerStyles: LayerProps = {
    id: "point",
    type: "circle",
    paint: {
        "circle-radius": 8,
        "circle-color": "#3519e6",
    },
};

const pathLayerStyles: LayerProps = {
    id: "line",
    type: "line",
    paint: {
        "line-width": 4,
        "line-color": "#5f45ff",
    },
};

// console.log(geoJson);

function RouteMap({ mapAccessToken }) {
    const geolocation = useGeolocation();
    const [from, setFrom] = useState({
        lat: 8.482998877918433,
        lng: 76.94755899999865,
    });
    const [destination, setDestination] = useState({ lat: null, lng: null });
    const [gotLocation, setGotLocation] = useState(false);
    const [path, setPath] = useState(null);

    useEffect(() => {
        if (gotLocation || !geolocation.accuracy) return;

        // setViewState((oldState) => ({
        //     ...oldState,
        //     longitude: geolocation.longitude,
        //     latitude: geolocation.latitude,
        // }));
        setGotLocation(true);
    }, [geolocation]);

    const [viewState, setViewState] = React.useState({
        longitude: from.lng,
        latitude: from.lat,
        zoom: 14,
    });

    useEffect(() => {
        const pathLayer = generateLineFromPoints(geoJson);
        setPath(pathLayer);
    }, [geoJson]);

    return (
        <div className="h-full min-h-screen w-full">
            {/* <pre>
                {JSON.stringify(geolocation, null, 2)}
                {JSON.stringify(viewState, null, 2)}
            </pre> */}
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={mapAccessToken}
                style={{ width: "100%", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                <NavigationControl />
                <GeolocateControl
                    onGeolocate={(evt: GeolocateResultEvent) =>
                        console.log({ evt })
                    }
                />
                <Marker
                    longitude={from.lng}
                    latitude={from.lat}
                    anchor="bottom"
                    draggable
                    onDrag={({ lngLat }) => setFrom(lngLat)}
                />
                <Source
                    id="blue-circular-data"
                    type="geojson"
                    data={geoJson as any}
                >
                    <Layer {...circularStopLayerStyles} />
                </Source>

                {!!path && (
                    <Source id="path-data" type="geojson" data={path as any}>
                        <Layer {...pathLayerStyles} />
                    </Source>
                )}
            </Map>
        </div>
    );
}

export default RouteMap;
