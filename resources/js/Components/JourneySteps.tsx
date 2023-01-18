import { Segment } from "@/utils/hooks/useJourney";
import React from "react";
import { FaCaretRight, FaFlag, FaMapMarkerAlt } from "react-icons/fa";

function JourneySteps({
    segment,
    expanded = false,
}: {
    segment?: Segment;
    expanded?: boolean;
}) {
    const stops = segment?.stops;
    const journey = segment?.path?.journey;
    const distance = Math.round((journey?.distance / 1000) * 100) / 100;
    const duration = Math.round(5 + (journey?.duration / 60) * 2);

    if (!expanded) {
        return (
            <span className="flex w-full items-center justify-between gap-5">
                {!!stops && (
                    <span className="flex items-center gap-1">
                        {stops[0].name}
                        <span className="text-2xl">
                            <FaCaretRight />
                        </span>
                        {stops[stops.length - 1].name}
                    </span>
                )}

                {!!journey && (
                    <span className="opacity-50">
                        Travel {distance} KM | {duration} Minutes
                    </span>
                )}
            </span>
        );
    }

    // Expanded view
    return (
        <span className="flex flex-col items-start gap-2">
            {!!segment?.circular && (
                <span>
                    <strong>{segment.circular.id}</strong> :{" "}
                    {segment.circular.name} circular
                </span>
            )}

            {!!stops && (
                <span className="">
                    <FaMapMarkerAlt className="mr-1 inline-block text-secondary" />
                    Hop on the bus from{" "}
                    <span className="font-bold text-secondary">
                        {stops[0].name}
                    </span>{" "}
                    stop
                </span>
            )}

            {!!journey && (
                <span className="-mt-1 opacity-50">
                    Travel {distance} KM | {duration} Minutes
                </span>
            )}

            {!!stops && (
                <>
                    <span>Intermediate stops</span>
                    <ul className="-mt-1 flex list-inside list-disc flex-col items-start opacity-90">
                        {stops.slice(1, stops.length - 1)?.map((stop, i) => (
                            <li key={`stop-${i}`}>
                                {stop?.name}{" "}
                                {/* ({stop.coordinates.join(", ")}) */}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {!!stops && (
                <span className="">
                    <FaFlag className="mr-2 inline-block text-secondary" />
                    Hop off the bus at{" "}
                    <span className="font-bold text-secondary">
                        {stops?.[stops.length - 1]?.name}
                    </span>{" "}
                    stop
                </span>
            )}
        </span>
    );
}

export default JourneySteps;
