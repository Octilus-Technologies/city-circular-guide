import JourneyControls from "@/Components/JourneyControls";
import BusRouteMap from "@/Components/map/BusRouteMap";
import SideBar from "@/Components/SideBar";
import { circulars } from "@/utils/geoJson";
import useJourney from "@/utils/hooks/useJourney";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { Marker } from "react-map-gl";

function RouteMap({ mapAccessToken }: { mapAccessToken: string }) {
    const geolocation = useGeolocation();
    const [from, setFrom] = useState([76.9475819999987, 8.48819065530084]);
    const [destination, setDestination] = useState([
        76.95039864193745, 8.502944175905867,
    ]);
    const [gotLocation, setGotLocation] = useState(false);

    useEffect(() => {
        if (gotLocation || !geolocation.accuracy) return;

        setGotLocation(true);
    }, [geolocation]);

    const [viewState, setViewState] = React.useState({
        longitude: from[0],
        latitude: from[1],
        zoom: 14,
    });

    const {
        paths,
        stops,
        meta: journeyDetails,
    } = useJourney(mapAccessToken, from, destination);

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
                    />
                    <Marker
                        key={"destination"}
                        longitude={destination[0]}
                        latitude={destination[1]}
                        anchor="bottom"
                        draggable
                        onDragEnd={({ lngLat }) =>
                            setDestination([lngLat.lng, lngLat.lat])
                        }
                    />
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
