import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import BusRouteMap from "@/Components/map/BusRouteMap";
import SideBar from "@/Components/SideBar";
import {
    circularColors,
    CircularName,
    circulars,
    Coordinates,
    generateLayerFromGeometry,
    getCircularCoordinates,
    getStopDetails,
} from "@/utils/geoJson";
import { getMatch } from "@/utils/mapbox-api";
import { Head, useRemember } from "@inertiajs/inertia-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Layer, LayerProps, Source } from "react-map-gl";

type CircularData = {
    name: CircularName;
    color: string;
    path: {
        type: string;
        features: {
            type: string;
            properties: Object;
            geometry: Object;
        }[];
    };
    stops: {
        coordinates: number[];
        name: string;
    }[];
    isActive: boolean;
};

const pathLayerStyles: LayerProps & Record<string, any> = {
    type: "line",
    paint: {
        "line-width": 4,
        "line-color": "royalblue",
        "line-opacity": 0.5,
        // "line-dasharray": [1, 2],
    },
};

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
    const [circularsData, setCircularsData] = useState<CircularData[]>([]);

    const isAllActive = useMemo(() => {
        return circularsData.every((circular) => circular.isActive);
    }, [circularsData]);

    useEffect(() => {
        const generatePathLayer = async () => {
            const circularNames = Object.keys(circulars) as CircularName[];
            let segments: Coordinates[][] = circularNames.map((key) =>
                getCircularCoordinates(key)
            );

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
            // const meta = segmentPath.map((path) => path?.journey);

            const circularsData = circularNames.map((name, index) => {
                const circularData = {
                    name,
                    color: circularColors[name],
                    path: paths[index],
                    stops: stops[index],
                    isActive: true,
                };

                return circularData;
            });

            setCircularsData(circularsData);
        };

        generatePathLayer();
    }, [circulars, mapAccessToken]);

    return (
        <>
            <Head title="Welcome" />

            <div className="h-full max-h-screen min-h-screen w-full flex-row-reverse">
                <section className="map-container relative flex flex-1">
                    <ul className="tab tabs-boxed absolute left-0 top-0 z-10 my-3 h-auto gap-2 bg-opacity-60 font-bold opacity-90 transition-all md:left-[40vw]">
                        <li key={`circular-all`}>
                            <button
                                onClick={() => {
                                    setCircularsData((prevData) => {
                                        const newData = [...prevData];
                                        newData.forEach((circular) => {
                                            circular.isActive = !isAllActive;
                                        });
                                        return newData;
                                    });
                                }}
                                className={`tab tab-active !px-4 !py-1 text-xs capitalize transition-all ${
                                    isAllActive ? "tab-active" : "opacity-50"
                                }`}
                            >
                                All
                            </button>
                        </li>
                        {circularsData.map((circular, i: number) => (
                            <li key={`circular-${i}`}>
                                <button
                                    onClick={() => {
                                        setCircularsData((prevData) => {
                                            const newData = [...prevData];
                                            newData[i].isActive =
                                                !newData[i].isActive;
                                            return newData;
                                        });
                                    }}
                                    className={`tab tab-active !px-4 !py-1 text-xs capitalize ${
                                        circular.isActive
                                            ? "tab-active"
                                            : "opacity-50"
                                    }`}
                                    style={{
                                        backgroundColor: circular.color,
                                    }}
                                >
                                    {circular.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <BusRouteMap
                        circulars={circulars}
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapboxAccessToken={mapAccessToken}
                    >
                        {circularsData
                            .filter((circular) => circular.isActive)
                            .map((circular, i: number) => {
                                const layerStyles = { ...pathLayerStyles };
                                if (circular.color && layerStyles) {
                                    layerStyles.paint = {
                                        ...layerStyles.paint,
                                        "line-color": circular.color,
                                    };
                                }

                                return (
                                    <Fragment key={`path-${i}`}>
                                        <Source
                                            id={`path-data-${i}`}
                                            type="geojson"
                                            data={circular.path as any}
                                        >
                                            <Layer
                                                {...layerStyles}
                                                id={`path-${i}-line`}
                                            />
                                        </Source>
                                    </Fragment>
                                );
                            })}
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
