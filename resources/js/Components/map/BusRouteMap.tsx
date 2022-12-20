import { circularColors, CircularGeojson, CircularName, circularNames } from "@/utils/geoJson";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, ReactNode } from "react";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    Layer,
    LayerProps,
    NavigationControl,
    Source,
    ViewStateChangeEvent,
} from "react-map-gl";
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
    ...props
}: {
    circulars: Record<CircularName, CircularGeojson>;
    paths?: Object[];
    children: ReactNode;
    onMove: (evt: ViewStateChangeEvent) => void;
} & Record<string, any>) {
    return (
        <Map
            {...props}
            onMove={onMove}
            style={{ width: "100%", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <NavigationControl />
            <GeolocateControl
                onGeolocate={(evt: GeolocateResultEvent) =>
                    console.log({ evt })
                }
            />

            {circularNames.map((circularName) => (
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
