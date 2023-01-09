import JourneyControls from "@/Components/JourneyControls";
import BusRouteMap from "@/Components/map/BusRouteMap";
import DestinationMarker from "@/Components/map/DestinationMarker";
import FromMarker from "@/Components/map/FromMarker";
import SideBar from "@/Components/SideBar";
import { circulars, Coordinates } from "@/utils/geoJson";
import useJourney from "@/utils/hooks/useJourney";
import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";

function RouteMap({
    mapAccessToken,
    journey,
}: {
    mapAccessToken: string;
    journey: JourneyDTO;
}) {
    // Return to initial page if journey details are not available
    if (!journey.from || !journey.destination) {
        return Inertia.visit("/");
    }

    const [from, setFrom] = useState<Coordinates>([
        journey.from.lng,
        journey.from.lat,
    ]);
    const [destination, setDestination] = useState<Coordinates>([
        journey.destination.lng,
        journey.destination.lat,
    ]);

    const {
        paths,
        stops,
        meta: journeyDetails,
        mapMeta,
    } = useJourney(mapAccessToken, from, destination);

    const [viewState, setViewState] = useState({
        longitude: from[0],
        latitude: from[1],
        zoom: 13.5,
    });

    useEffect(() => {
        setViewState((oldViewState) => {
            const moveToCoordinate = mapMeta?.center;
            if (!moveToCoordinate) return oldViewState;

            return {
                ...oldViewState,
                longitude: moveToCoordinate[0] - 0.008,
                latitude: moveToCoordinate[1],
            };
        });
    }, [mapMeta?.center]);

    return (
        <div className="h-full max-h-screen min-h-screen w-full flex-row-reverse">
            <section className="map-container flex flex-1">
                <BusRouteMap
                    paths={paths}
                    circulars={circulars}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapboxAccessToken={mapAccessToken}
                >
                    <FromMarker
                        coords={from}
                        setCoords={setFrom}
                        draggable={true}
                    />
                    <DestinationMarker
                        coords={destination}
                        setCoords={setDestination}
                        draggable={true}
                    />
                </BusRouteMap>
            </section>

            <SideBar>
                <div className="alert inline-block w-auto bg-opacity-10 text-primary-content backdrop-blur-sm">
                    <JourneyControls
                        expanded={true}
                        stops={stops}
                        journeyDetails={journeyDetails}
                        journey={journey}
                    />
                </div>
            </SideBar>
        </div>
    );
}

export default RouteMap;
