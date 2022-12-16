import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import BusRouteMap from "@/Components/map/BusRouteMap";
import SideBar from "@/Components/SideBar";
import {
    CircularName,
    circulars,
    Coordinates,
    generateLayerFromGeometry,
    getCircularCoordinates,
    getStopDetails,
} from "@/utils/geoJson";
import { getMatch } from "@/utils/mapbox-api";
import { Head } from "@inertiajs/inertia-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";

export default function Welcome({
    mapAccessToken,
}: {
    mapAccessToken: string;
}) {
    const [viewState, setViewState] = useState({
        longitude: 76.93,
        latitude: 8.51,
        zoom: 12.5,
    });
    const [paths, setPaths] = useState<any[]>([]);
    const [stops, setStops] = useState<
        {
            coordinates: number[];
            name: string;
        }[][]
    >([]);

    useEffect(() => {
        const generatePathLayer = async () => {
            let segments: Coordinates[][] = (
                Object.keys(circulars) as CircularName[]
            ).map((key) => getCircularCoordinates(key));

            // Add first stop as last stop to make it circular
            segments = segments.map((stops) => [...stops, stops[0]]);

            const segmentPathPromises = segments.map((segment) =>
                getMatch(mapAccessToken, segment)
            );
            const segmentPath = await Promise.all(segmentPathPromises);

            const paths = segmentPath.map((path) =>
                generateLayerFromGeometry(path?.geometry as any)
            );
            const stops = segments.map((segment) => getStopDetails(segment));
            const meta = segmentPath.map((path) => path?.journey);

            setPaths(paths);
            setStops(stops);
        };

        generatePathLayer();
    }, [circulars, mapAccessToken]);

    return (
        <>
            <Head title="Welcome" />

            <div className="h-full max-h-screen min-h-screen w-full flex-row-reverse">
                <section className="map-container relative flex flex-1">
                    <BusRouteMap
                        paths={paths}
                        circulars={circulars}
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapboxAccessToken={mapAccessToken}
                    >
                        // TODO: Generate different colored paths
                    </BusRouteMap>
                </section>

                <SideBar>
                    <InitialRouteQueryForm
                        accessToken={mapAccessToken}
                        className="mt-5"
                    />
                </SideBar>
            </div>
        </>
    );
}
