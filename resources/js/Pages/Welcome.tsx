import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import BusRouteMap from "@/Components/map/BusRouteMap";
import DestinationMarker from "@/Components/map/DestinationMarker";
import FromMarker from "@/Components/map/FromMarker";
import SideBar from "@/Components/SideBar";
import useCirculars from "@/utils/hooks/userCirculars";
import { Head } from "@inertiajs/inertia-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, useState } from "react";
import { Layer, LayerProps, Marker, Source } from "react-map-gl";

const pathLayerStyles: LayerProps & Record<string, any> = {
    type: "line",
    paint: {
        "line-width": 4,
        "line-color": "royalblue",
        "line-opacity": 0.5,
        // "line-dasharray": [1, 2],
    },
};

export default function Welcome({
    mapAccessToken,
}: {
    mapAccessToken: string;
}) {
    const [fromCoords, setFromCoords] = useState<number[]>();
    const [destinationCoords, setDestinationCoords] = useState<number[]>();

    const [viewState, setViewState] = useState({
        longitude: 76.93,
        latitude: 8.51,
        zoom: 12.5,
    });

    const {
        circulars,
        toggleCircularPath,
        isAllActive,
        geoJson: circularsGeojson,
    } = useCirculars(mapAccessToken);

    return (
        <>
            <Head title="Welcome" />

            <div className="h-full max-h-screen min-h-screen w-full flex-row-reverse">
                <section className="map-container relative flex flex-1">
                    <ul className="tab tabs-boxed absolute left-0 top-0 z-10 my-3 flex h-auto flex-wrap gap-2 bg-opacity-60 font-bold opacity-90 transition-all md:left-[40vw]">
                        <li key={`circular-all`}>
                            <button
                                onClick={() => toggleCircularPath()}
                                className={`tab tab-active !px-4 !py-1 text-xs capitalize transition-all ${
                                    isAllActive ? "tab-active" : "opacity-50"
                                }`}
                            >
                                All
                            </button>
                        </li>
                        {circulars.map((circular, i: number) => (
                            <li key={`circular-${i}`}>
                                <button
                                    onClick={() => toggleCircularPath(i)}
                                    className={`tab tab-active !px-4 !py-1 text-xs capitalize transition-all ${
                                        circular.isActive
                                            ? "tab-active"
                                            : "opacity-50"
                                    }`}
                                    style={{
                                        backgroundColor: circular.color,
                                    }}
                                >
                                    {circular.name}
                                </button>
                            </li>
                        ))}
                    </ul>

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

                        {circulars
                            .filter((circular) => circular.isActive)
                            .map((circular, i: number) => {
                                const layerStyles = { ...pathLayerStyles };
                                if (circular.color && layerStyles) {
                                    layerStyles.paint = {
                                        ...layerStyles.paint,
                                        "line-color": circular.color,
                                    };
                                }

                                return (
                                    <Fragment key={`path-${i}`}>
                                        <Source
                                            id={`path-data-${i}`}
                                            type="geojson"
                                            data={circular.path as any}
                                        >
                                            <Layer
                                                {...layerStyles}
                                                id={`path-${i}-line`}
                                            />
                                        </Source>
                                    </Fragment>
                                );
                            })}
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
