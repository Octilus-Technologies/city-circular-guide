import JourneyControls from "@/Components/JourneyControls";
import BusRouteMap from "@/Components/map/BusRouteMap";
import DestinationMarker from "@/Components/map/DestinationMarker";
import FromMarker from "@/Components/map/FromMarker";
import SideBar from "@/Components/SideBar";
import { circulars, Coordinates } from "@/utils/geoJson";
import useJourney from "@/utils/hooks/useJourney";
import useViewState from "@/utils/hooks/useViewState";
import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useMemo, useState } from "react";

const isProduction = process.env.NODE_ENV === "production";
const isTesting = !isProduction;

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

    const journeyFrom = useMemo(
        () => ({
            name: journey.from.name,
            coords: from,
        }),
        [from, journey.from.name]
    );

    const journeyTo = useMemo(
        () => ({
            name: journey.destination.name,
            coords: destination,
        }),
        [destination, journey.destination.name]
    );

    const { segments, mapMeta } = useJourney(
        mapAccessToken,
        journeyFrom,
        journeyTo
    );

    const [viewState, setViewState] = useViewState({
        longitude: journeyFrom.coords[0],
        latitude: journeyFrom.coords[1],
        zoom: 13.5,
    });

    // console.log("viewState", viewState);

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
        <div className="h-full max-h-[100dvh] min-h-[100dvh] w-full flex-row-reverse">
            <section className="map-container flex flex-1">
                <BusRouteMap
                    segments={segments}
                    circulars={circulars}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapboxAccessToken={mapAccessToken}
                >
                    <FromMarker
                        coords={from}
                        setCoords={setFrom}
                        draggable={isTesting}
                    />
                    <DestinationMarker
                        coords={destination}
                        setCoords={setDestination}
                        draggable={isTesting}
                    />
                </BusRouteMap>
            </section>

            <SideBar>
                <div className="alert inline-block w-auto bg-opacity-10 text-primary-content backdrop-blur-sm">
                    {!!segments && (
                        <JourneyControls
                            expanded={true}
                            segments={segments}
                            journey={journey}
                        />
                    )}
                </div>
            </SideBar>
        </div>
    );
}

export default RouteMap;
