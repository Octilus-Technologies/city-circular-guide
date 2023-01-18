import { Segment } from "@/utils/hooks/useJourney";
import React from "react";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";

function WalkSteps({
    segment,
    expanded = false,
}: {
    segment: Segment;
    expanded?: boolean;
}) {
    const journey = segment?.path?.journey;
    const distance = Math.round((journey?.distance / 1000) * 100) / 100;
    const duration = Math.round(journey?.duration / 60) * 3;

    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" />
                <span className="text-sm">
                    Walk from{" "}
                    <span className="font-bold text-secondary">
                        {segment.from}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-secondary">
                        {segment.destination}
                    </span>
                </span>
                <FaFlag className="mr-2 inline-block text-secondary" />
            </span>

            {!!journey && (
                <span className="opacity-50">
                    {distance} KM | {duration} Minutes
                </span>
            )}
        </div>
    );
}

export default WalkSteps;
