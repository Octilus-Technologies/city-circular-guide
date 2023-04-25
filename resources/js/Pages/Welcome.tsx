import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import BusRouteMap from "@/Components/map/BusRouteMap";
import CircularFilter from "@/Components/map/CircularFilter";
import CircularPathLayer from "@/Components/map/CircularPathLayer";
import DestinationMarker from "@/Components/map/DestinationMarker";
import FromMarker from "@/Components/map/FromMarker";
import SideBar from "@/Components/SideBar";
import { Coordinates } from "@/utils/geoJson";
import useCirculars from "@/utils/hooks/useCirculars";
import useViewState from "@/utils/hooks/useViewState";
import { Head } from "@inertiajs/react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useMemo, useState } from "react";

export default function Welcome({
    mapAccessToken,
}: {
    mapAccessToken: string;
}) {
    const [fromCoords, setFromCoords] = useState<Coordinates>();
    const [destinationCoords, setDestinationCoords] = useState<Coordinates>();

    const [viewState, setViewState] = useViewState();

    const {
        circulars,
        toggleCircularPath,
        isAllActive,
        geoJson: circularsGeojson,
    } = useCirculars(mapAccessToken);

    const activeCirculars = useMemo(
        () => circulars.filter((circular) => circular.isActive),
        [circulars]
    );

    return (
        <>
            <Head title="Welcome" />

            <div className="h-full max-h-[100dvh] min-h-[100dbh] w-full flex-row-reverse">
                <section className="map-container relative flex flex-1">
                    <CircularFilter
                        circulars={circulars}
                        toggleCircularPath={toggleCircularPath}
                        isAllActive={isAllActive}
                    />

                    <BusRouteMap
                        activeCirculars={circulars.filter(
                            (circular) => circular.isActive
                        )}
                        circulars={circularsGeojson}
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapboxAccessToken={mapAccessToken}
                    >
                        {!!fromCoords && <FromMarker coords={fromCoords} />}
                        {!!destinationCoords && (
                            <DestinationMarker coords={destinationCoords} />
                        )}

                        {activeCirculars.map((circular) => (
                            <CircularPathLayer
                                circular={circular}
                                key={`circular-path-layer-${circular.id}`}
                            />
                        ))}
                    </BusRouteMap>
                </section>

                <SideBar>
                    <InitialRouteQueryForm
                        accessToken={mapAccessToken}
                        className="mt-5"
                        setFromCoords={setFromCoords}
                        setDestinationCoords={setDestinationCoords}
                    />
                </SideBar>
            </div>
        </>
    );
}
