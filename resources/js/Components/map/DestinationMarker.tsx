import React, { ComponentProps } from "react";
import { FaFlag } from "react-icons/fa";
import Marker from "./Marker";

function DestinationMarker({ ...props }: ComponentProps<typeof Marker>) {
    return (
        <Marker {...props}>
            <FaFlag className="inline-block text-3xl text-secondary opacity-90" />
        </Marker>
    );
}

export default DestinationMarker;
