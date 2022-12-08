import JourneyControls from "@/Components/JourneyControls";
import BusStopsLayer from "@/Components/map/BusStopsLayer";
import {
    circulars,
    generateLayerFromGeometry,
    getStopDetails,
} from "@/utils/geoJson";
import { getOptimizedStops } from "@/utils/map-helpers";
import { getMatch } from "@/utils/mapbox-api";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, useEffect, useState } from "react";
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

const pathLayerStyles: LayerProps = {
    type: "line",
    paint: {
        "line-width": 4,
        "line-color": "royalblue",
        "line-opacity": 0.75,
        // "line-dasharray": [1, 2],
    },
};

function RouteMap({ mapAccessToken }) {
    const geolocation = useGeolocation();
    const [from, setFrom] = useState([76.9475819999987, 8.48819065530084]);
    const [destination, setDestination] = useState([
        76.95039864193745, 8.502944175905867,
    ]);
    const [gotLocation, setGotLocation] = useState(false);
    const [paths, setPaths] = useState<any>();
    const [stops, setStops] = useState<
        {
            coordinates: number[];
            name: string;
        }[][]
    >();
    const [journeyDetails, setJourneyDetails] = useState<any[]>();

    useEffect(() => {
        if (gotLocation || !geolocation.accuracy) return;

        setGotLocation(true);
    }, [geolocation]);

    const [viewState, setViewState] = React.useState({
        longitude: from[0],
        latitude: from[1],
        zoom: 14,
    });

    useEffect(() => {
        const generatePathLayer = async () => {
            const segments = getOptimizedStops(from, destination);
            if (!segments || !segments.length)
                return console.log("Unable to find a route");

            const segmentPathPromises = segments.map((segment) =>
                getMatch(mapAccessToken, segment)
            );
            const segmentPath = await Promise.all(segmentPathPromises);
            const pathLayers = segmentPath.map((path) =>
                generateLayerFromGeometry(path?.geometry as any)
            );

            setStops(segments.map((segment) => getStopDetails(segment)));
            setJourneyDetails(segmentPath?.map((p) => p?.journey));
            setPaths(pathLayers);
            // console.table(pathLayers.map((path) => path.features[0].geometry));
        };

        generatePathLayer();
    }, [circulars.blue, from, destination]);

    return (
        <div className="h-full min-h-screen w-full">
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
                    longitude={from[0]}
                    latitude={from[1]}
                    anchor="bottom"
                    draggable
                    onDragEnd={({ lngLat }: MarkerDragEvent) =>
                        setFrom([lngLat.lng, lngLat.lat])
                    }
                />
                <Marker
                    key={"destination"}
                    longitude={destination[0]}
                    latitude={destination[1]}
                    anchor="bottom"
                    draggable
                    onDragEnd={({ lngLat }: MarkerDragEvent) =>
                        setDestination([lngLat.lng, lngLat.lat])
                    }
                />
                <BusStopsLayer
                    id="blue-circular-data"
                    type="geojson"
                    data={circulars.blue as any}
                    layerProps={{
                        id: "blue-point",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": "#3519e6",
                            "circle-opacity": 0.75,
                        },
                    }}
                />

                <BusStopsLayer
                    id="red-circular-data"
                    type="geojson"
                    data={circulars.red as any}
                    layerProps={{
                        id: "red-point",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": "#ff0000",
                            "circle-opacity": 0.75,
                        },
                    }}
                />

                {paths?.map((path, i) => (
                    <Fragment key={`path-${i}`}>
                        <Source
                            id={`path-data-${i}`}
                            type="geojson"
                            data={path as any}
                        >
                            <Layer {...pathLayerStyles} id={`path-${i}-line`} />
                        </Source>
                    </Fragment>
                ))}
            </Map>

            <div className="actions fixed bottom-0 left-0 right-0 z-50 m-5 text-center">
                <div className="alert inline-block w-auto bg-opacity-80 text-primary-content shadow-lg backdrop-blur-sm">
                    <JourneyControls
                        stops={stops}
                        journeyDetails={journeyDetails}
                    />
                </div>
            </div>
        </div>
    );
}

export default RouteMap;
