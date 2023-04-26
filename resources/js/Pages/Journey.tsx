import JourneyControls from "@/Components/JourneyControls";
import BusRouteMap from "@/Components/map/BusRouteMap";
import DestinationMarker from "@/Components/map/DestinationMarker";
import FromMarker from "@/Components/map/FromMarker";
import SideBar from "@/Components/SideBar";
import { Coordinates, getCirculars } from "@/utils/geoJson";
import useJourney from "@/utils/hooks/useJourney";
import useViewState from "@/utils/hooks/useViewState";
import { router } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";

const isProduction = process.env.NODE_ENV === "production";
const isTesting = !isProduction;

function Journey({
    mapAccessToken,
    journey,
}: {
    mapAccessToken: string;
    journey: JourneyDTO;
}) {
    // Return to initial page if journey details are not available
    if (!journey.from || !journey.destination) {
        return router.visit("/");
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

    const activeCirculars = segments
        ?.map((s) => s.circular)
        .filter((c): c is NonNullable<typeof c> => !!c);

    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        if (isMobile) setExpanded(false);
    }, [])

    return (
        <div className="h-full max-h-[100dvh] min-h-[100dvh] w-full flex-row-reverse">
            <section className="map-container flex flex-1">
                <BusRouteMap
                    segments={segments}
                    circulars={getCirculars(false)}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapboxAccessToken={mapAccessToken}
                    activeCirculars={activeCirculars}
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

            <SideBar
                toggleExpanded={() => setExpanded((expanded) => !expanded)}
                expanded={expanded}
            >
                <div className="alert inline-block w-full bg-opacity-10 text-primary-content backdrop-blur-sm">
                    {!!segments && (
                        <JourneyControls
                            expanded={expanded}
                            segments={segments}
                            journey={journey}
                        />
                    )}
                </div>
            </SideBar>
        </div>
    );
}

export default Journey;
