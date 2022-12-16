import React from "react";
import { FaCaretRight, FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import { Journey } from "./JourneyControls";

function JourneySteps({
    segment,
    journey,
    expanded = false,
}: {
    segment?: {
        coordinates: number[];
        name: string;
    }[];
    journey?: Journey;
    expanded?: boolean;
}) {
    if (!expanded) {
        return (
            <span className="flex w-full items-center justify-between gap-5">
                {!!segment && !!segment.length && (
                    <span className="flex items-center gap-1">
                        {segment?.[0]?.name}
                        <span className="text-2xl">
                            <FaCaretRight />
                        </span>
                        {segment?.[segment.length - 1]?.name}
                    </span>
                )}

                {!!journey && (
                    <span className="opacity-50">
                        {Math.round(journey?.distance / 1000)} KM |{" "}
                        {Math.round(journey?.duration / 60) * 1} Minutes
                    </span>
                )}
            </span>
        );
    }

    // Expanded view
    return (
        <span className="flex flex-col items-start gap-2">
            {!!segment && !!journey && (
                <span className="">
                    <FaMapMarkerAlt className="mr-1 inline-block text-secondary" />
                    Hop on the bus from{" "}
                    <span className="font-bold text-secondary">
                        {segment[0].name}
                    </span>{" "}
                    stop
                </span>
            )}

            {!!journey && (
                <span className="-mt-1 opacity-50">
                    Travel {Math.round(journey?.distance / 1000)} KM |{" "}
                    {Math.round(journey?.duration / 60) * 1} Minutes
                </span>
            )}

            {!!segment && !!segment.length && (
                <>
                    <span>Intermediate stops</span>
                    <ul className="-mt-1 flex list-inside list-disc flex-col items-start opacity-90">
                        {segment?.map((stop, i) => (
                            <li key={`stop-${i}`}>{stop.name}</li>
                        ))}
                    </ul>
                </>
            )}

            {!!segment && !!journey && (
                <span className="">
                    <FaFlag className="mr-2 inline-block text-secondary" />
                    Hop off the bus at{" "}
                    <span className="font-bold text-secondary">
                        {segment[segment.length - 1].name}
                    </span>{" "}
                    stop
                </span>
            )}
        </span>
    );
}

export default JourneySteps;