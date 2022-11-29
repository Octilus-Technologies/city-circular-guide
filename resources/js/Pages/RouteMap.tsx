import geoJson from "@/constants/blue.json";
import { generateLayerFromGeometry } from "@/utils/geoJson";
import { getMatch } from "@/utils/mapbox-api";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    Layer,
    LayerProps,
    Marker,
    MarkerDragEvent,
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
        lng: 76.9475819999987,
        lat: 8.48819065530084,
    });
    const [destination, setDestination] = useState({
        lng: 76.95039864193745,
        lat: 8.502944175905867,
    });
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
        const generatePathLayer = async () => {
            const coordinates = geoJson.features.map(
                (f) => f.geometry.coordinates
            );
            coordinates.unshift([from.lng, from.lat]);
            coordinates.push([destination.lng, destination.lat]);

            const geometry = await getMatch(mapAccessToken, coordinates);
            const pathLayer = generateLayerFromGeometry(geometry as any);

            setPath(pathLayer);
        };

        generatePathLayer();
    }, [geoJson, from, destination]);

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
                    key={"from"}
                    longitude={from.lng}
                    latitude={from.lat}
                    anchor="bottom"
                    draggable
                    onDragEnd={({ lngLat }: MarkerDragEvent) => setFrom(lngLat)}
                />
                <Marker
                    key={"destination"}
                    longitude={destination.lng}
                    latitude={destination.lat}
                    anchor="bottom"
                    draggable
                    onDragEnd={({ lngLat }: MarkerDragEvent) =>
                        setDestination(lngLat)
                    }
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
