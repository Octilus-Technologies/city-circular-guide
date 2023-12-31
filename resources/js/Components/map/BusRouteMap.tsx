import BusStopInfo from "@/Components/BusStopInfo";
import BusStopsLayer from "@/Components/map/BusStopsLayer";
import SegmentLayer from "@/Components/map/SegmentLayer";
import {
    CircularGeojson,
    CircularName,
    circularNames,
    getCircular,
    getStopDetails,
} from "@/utils/geoJson";
import { Segment } from "@/utils/hooks/useJourney";
import { findNearestStop, getCircularDetails } from "@/utils/map-helpers";
import { PropsOf } from "@headlessui/react/dist/types";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { ReactNode, useCallback, useState } from "react";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    LngLatBoundsLike,
    MapLayerMouseEvent,
    NavigationControl,
    Popup,
    ViewStateChangeEvent,
} from "react-map-gl";

type BusRouteMapProps = {
    circulars: Record<CircularName, CircularGeojson>;
    segments?: Segment[];
    children: ReactNode;
    onMove: (evt: ViewStateChangeEvent) => void;
    activeCirculars?: { name: string; color: string; isClockwise: boolean }[];
    maxBounds?: LngLatBoundsLike;
} & Partial<PropsOf<typeof Map>>;

function BusRouteMap({
    circulars,
    segments,
    children,
    onMove,
    activeCirculars,
    maxBounds,
    ...props
}: BusRouteMapProps) {
    activeCirculars ??= circularNames
        .map((cName) => getCircularDetails(cName))
        .filter((c): c is NonNullable<typeof c> => !!c);

    const [popup, setPopup] = useState<{
        coordinates?: number[];
        show: boolean;
        stop?: ReturnType<typeof getStopDetails>[number];
    }>({
        show: false,
    });

    const handleClick = useCallback(
        (event: MapLayerMouseEvent) => {
            const nearestStop = findNearestStop([
                event.lngLat.lng,
                event.lngLat.lat,
            ]);
            if (!nearestStop || nearestStop.distance > 50) return;

            const { stop } = nearestStop;
            console.log("stop", stop);

            // Make sure the popup is hidden before showing it again
            setPopup((prevPopup) => ({
                show: false,
            }));

            setTimeout(() => {
                if (!stop) return;

                setPopup((prevPopup) => ({
                    ...prevPopup,
                    coordinates: stop.coordinates,
                    show: true,
                    stop,
                }));
            }, 100);
        },
        [findNearestStop, getStopDetails]
    );

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

            {activeCirculars.map((circular) => (
                <BusStopsLayer
                    key={`${circular.name}-circular-data`}
                    id={`${circular.name}-circular-data`}
                    type="geojson"
                    data={
                        getCircular(circular.name, circular.isClockwise) as any
                    }
                    layerProps={{
                        id: `${circular.name}-point`,
                        paint: {
                            "circle-radius": 3,
                            "circle-color": circular.color,
                            "circle-opacity": 0.75,
                        },
                    }}
                />
            ))}

            {segments
                ?.filter((segment) => !!segment.path?.geometry)
                .map((segment, i) => (
                    <SegmentLayer
                        key={`segment-${i}`}
                        segment={segment}
                        id={i}
                    />
                ))}

            {children}
        </Map>
    );
}

export default BusRouteMap;
