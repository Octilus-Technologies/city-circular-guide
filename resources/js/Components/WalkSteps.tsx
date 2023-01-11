import { Segment } from "@/utils/hooks/useJourney";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

function WalkSteps({
    segment,
    expanded = false,
}: {
    segment: Segment;
    expanded?: boolean;
}) {
    const journey = segment?.path?.journey;

    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-xl text-secondary" />
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
            </span>

            {!!journey && (
                <span className="opacity-50">
                    {Math.round(journey?.distance / 1000)} KM |{" "}
                    {Math.round(journey?.duration / 60) * 1} Minutes
                </span>
            )}
        </div>
    );
}

export default WalkSteps;
