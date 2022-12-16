import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import SideBar from "@/Components/SideBar";
import { Head } from "@inertiajs/inertia-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import Map, {
    GeolocateControl,
    GeolocateResultEvent,
    NavigationControl,
} from "react-map-gl";

export default function Welcome({
    mapAccessToken,
}: {
    mapAccessToken: string;
}) {
    const [viewState, setViewState] = React.useState({
        longitude: 76.91,
        latitude: 8.5,
        zoom: 12,
    });

    return (
        <>
            <Head title="Welcome" />

            <div className="h-full max-h-screen min-h-screen w-full flex-row-reverse">
                <section className="map-container relative flex flex-1">
                    <Map
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapboxAccessToken={mapAccessToken}
                        style={{ width: "100%", height: "100vh" }}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                        <NavigationControl />
                        <GeolocateControl
                            onGeolocate={(evt: GeolocateResultEvent) =>
                                console.log({ evt })
                            }
                        />
                    </Map>
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
