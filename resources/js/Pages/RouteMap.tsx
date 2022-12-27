import JourneyControls from "@/Components/JourneyControls";
import BusRouteMap from "@/Components/map/BusRouteMap";
import SideBar from "@/Components/SideBar";
import { circulars, Coordinates } from "@/utils/geoJson";
import useJourney from "@/utils/hooks/useJourney";
import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import { Marker } from "react-map-gl";

function RouteMap({ mapAccessToken }: { mapAccessToken: string }) {
    const url = new URL(window.location.href);

    const geolocation = useGeolocation();
    const [from, setFrom] = useState<Coordinates | undefined>(
        url.searchParams.get("from")?.split(",").map(parseFloat)
    );
    const [destination, setDestination] = useState<Coordinates | undefined>(
        url.searchParams.get("destination")?.split(",").map(parseFloat)
    );
    const [gotLocation, setGotLocation] = useState(false);

    // Return to previous page if from or destination is not set
    if (!from || !destination) {
        return Inertia.visit("/");
    }

    useEffect(() => {
        if (gotLocation || !geolocation.accuracy) return;

        setGotLocation(true);
    }, [geolocation]);

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
                    <Marker
                        key={"from"}
                        longitude={from[0]}
                        latitude={from[1]}
                        anchor="bottom"
                        draggable
                        onDragEnd={({ lngLat }) =>
                            setFrom([lngLat.lng, lngLat.lat])
                        }
                    >
                        <FaMapMarkerAlt className="inline-block text-3xl text-secondary opacity-90" />
                    </Marker>
                    <Marker
                        key={"destination"}
                        longitude={destination[0]}
                        latitude={destination[1]}
                        anchor="bottom"
                        draggable
                        onDragEnd={({ lngLat }) =>
                            setDestination([lngLat.lng, lngLat.lat])
                        }
                    >
                        <FaFlag className="inline-block text-3xl text-secondary opacity-90" />
                    </Marker>
                </BusRouteMap>
            </section>

            <SideBar>
                <div className="alert inline-block w-auto bg-opacity-10 text-primary-content backdrop-blur-sm">
                    <JourneyControls
                        expanded={true}
                        stops={stops}
                        journeyDetails={journeyDetails}
                    />
                </div>
            </SideBar>
        </div>
    );
}

export default RouteMap;
