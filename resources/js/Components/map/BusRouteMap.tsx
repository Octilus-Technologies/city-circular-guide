import {
    circularColors,
    CircularGeojson,
    CircularName,
    circularNames,
    getStopDetails,
} from "@/utils/geoJson";
import { CircularData } from "@/utils/hooks/userCirculars";
import { findNearestStop } from "@/utils/map-helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, ReactNode, useState } from "react";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    Layer,
    LayerProps,
    LngLatBoundsLike,
    MapLayerMouseEvent,
    NavigationControl,
    Popup,
    Source,
    ViewStateChangeEvent,
} from "react-map-gl";
import BusStopInfo from "../BusStopInfo";
import BusStopsLayer from "./BusStopsLayer";

const pathLayerStyles: LayerProps = {
    type: "line",
    paint: {
        "line-width": 4,
        "line-color": "royalblue",
        "line-opacity": 0.75,
        // "line-dasharray": [1, 2],
    },
};

function BusRouteMap({
    circulars,
    paths = [],
    children,
    onMove,
    activeCirculars,
    maxBounds,
    ...props
}: {
    circulars: Record<CircularName, CircularGeojson>;
    paths?: Object[];
    children: ReactNode;
    onMove: (evt: ViewStateChangeEvent) => void;
    activeCirculars?: CircularData[];
    maxBounds?: LngLatBoundsLike;
} & Record<string, any>) {
    const activeCircularsNames =
        activeCirculars?.map((c) => c.name) ?? circularNames;

    const [popup, setPopup] = useState<{
        coordinates?: number[];
        show: boolean;
        stop?: ReturnType<typeof getStopDetails>[number];
    }>({
        show: false,
    });
    console.log(popup);

    const handleClick = (event: MapLayerMouseEvent) => {
        const nearestStop = findNearestStop([
            event.lngLat.lng,
            event.lngLat.lat,
        ]);
        if (!nearestStop || nearestStop.distance > 120) return;

        const stop = getStopDetails([nearestStop.coordinates])[0];
        console.log(stop);

        setPopup((prevPopup) => ({
            show: false,
        }));

        setTimeout(() => {
            setPopup((prevPopup) => ({
                ...prevPopup,
                coordinates: stop.coordinates,
                show: true,
                stop,
            }));
        }, 100);
    };

    return (
        <Map
            maxBounds={maxBounds}
            onClick={handleClick}
            {...props}
            onMove={onMove}
            style={{ width: "100%", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            {!!popup.show && !!popup.stop && !!popup.coordinates && (
                <Popup
                    longitude={popup.coordinates[0]}
                    latitude={popup.coordinates[1]}
                    anchor="bottom"
                    onClose={() => setPopup({ ...popup, show: false })}
                >
                    <BusStopInfo stop={popup.stop} />
                </Popup>
            )}

            <NavigationControl />
            <GeolocateControl
                onGeolocate={(evt: GeolocateResultEvent) =>
                    console.log({ evt })
                }
            />

            {activeCircularsNames.map((circularName) => (
                <BusStopsLayer
                    key={`${circularName}-circular-data`}
                    id={`${circularName}-circular-data`}
                    type="geojson"
                    data={circulars[circularName] as any}
                    layerProps={{
                        id: `${circularName}-point`,
                        paint: {
                            "circle-radius": 8,
                            "circle-color": circularColors[circularName],
                            "circle-opacity": 0.75,
                        },
                    }}
                />
            ))}

            {paths?.map((path: any, i: number) => (
                <Fragment key={`path-${i}`}>
                    <Source id={`path-data-${i}`} type="geojson" data={path}>
                        <Layer {...pathLayerStyles} id={`path-${i}-line`} />
                    </Source>
                </Fragment>
            ))}

            {children}
        </Map>
    );
}

export default BusRouteMap;
