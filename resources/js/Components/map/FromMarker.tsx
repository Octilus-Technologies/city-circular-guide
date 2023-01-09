import React, { ComponentProps } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Marker from "./Marker";

function DestinationMarker({ ...props }: ComponentProps<typeof Marker>) {
    return (
        <Marker {...props}>
            <FaMapMarkerAlt className="inline-block text-3xl text-secondary opacity-90" />
        </Marker>
    );
}

export default DestinationMarker;
