import CircularIcon from "@/Components/Icons/CircularIcon";
import { Segment } from "@/utils/hooks/useJourney";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { useState } from "react";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";

function JourneySteps({
    segment,
    expanded = false,
}: {
    segment?: Segment;
    expanded?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [animationParent, enableAnimations] =
        useAutoAnimate<HTMLUListElement>();

    const stops = segment?.stops;
    const journey = segment?.path?.journey;
    const distance = Math.round((journey?.distance / 1000) * 100) / 100;
    const duration = Math.round(5 + (journey?.duration / 60) * 2);
    const intermediateStops = stops?.slice(1, stops.length - 1);

    return (
        <div className="flex flex-col items-start gap-2">
            {!!segment?.circular && (
                <p className="flex items-center justify-center gap-2">
                    <CircularIcon
                        name={segment.circular.name}
                        color={segment.circular.color}
                    />
                    <span className="opacity-70">
                        {segment.circular.label} circular
                    </span>
                </p>
            )}

            {!!stops && (
                <p className="">
                    <FaMapMarkerAlt className="mr-1 inline-block text-secondary" />
                    Hop on the <strong>{segment?.circular?.id}</strong> bus from{" "}
                    <span className="font-bold text-secondary">
                        {stops[0]?.name}
                    </span>{" "}
                    stop
                </p>
            )}

            {!!journey && (
                <p className="-mt-1 opacity-60">
                    Travel {distance} KM | {duration} Minutes
                </p>
            )}

            {!!intermediateStops?.length && (
                <div className="opacity-80">
                    <button
                        onClick={() => setIsExpanded((val) => !val)}
                        className="btn-link btn h-auto min-h-fit p-0 capitalize text-inherit no-underline"
                    >
                        {intermediateStops.length} intermediate stops (
                        {isExpanded ? "hide" : "show"})
                    </button>

                    {
                        <ul
                            ref={animationParent}
                            className="mt-1 flex list-inside list-disc flex-col items-start opacity-90"
                        >
                            {isExpanded &&
                                intermediateStops?.map((stop, i) => (
                                    <li key={`stop-${i}`}>{stop?.name}</li>
                                ))}
                        </ul>
                    }
                </div>
            )}

            {!!stops && (
                <p className="">
                    <FaFlag className="mr-2 inline-block text-secondary" />
                    Hop off the bus at{" "}
                    <span className="font-bold text-secondary">
                        {stops?.[stops.length - 1]?.name}
                    </span>{" "}
                    stop
                </p>
            )}
        </div>
    );
}

export default JourneySteps;
