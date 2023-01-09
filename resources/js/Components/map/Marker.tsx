import React, { ComponentProps, SetStateAction } from "react";
import { FaFlag } from "react-icons/fa";
import { Marker as BaseMarker } from "react-map-gl";

function Marker({
    coords,
    setCoords,
    ...props
}: {
    coords: number[];
    setCoords?: (value: SetStateAction<number[]>) => void;
} & Partial<ComponentProps<typeof BaseMarker>>) {
    return (
        <BaseMarker
            {...props}
            key={"destination"}
            longitude={coords[0]}
            latitude={coords[1]}
            anchor="bottom"
            onDragEnd={({ lngLat }) =>
                setCoords ? setCoords([lngLat.lng, lngLat.lat]) : null
            }
        >
            {props?.children}
        </BaseMarker>
    );
}

export default Marker;
