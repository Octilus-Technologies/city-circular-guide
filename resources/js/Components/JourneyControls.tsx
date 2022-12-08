import { Inertia } from "@inertiajs/inertia";
import { GeometryObject } from "@turf/turf";
import React from "react";
import { FaCaretRight } from "react-icons/fa";

type JourneyControlProps = {
    expanded?: boolean;
    stops?: { coordinates: number[]; name: string }[][];
    journeyDetails?: Journey[];
};

interface Journey {
    via_waypoints: any[];
    admins: any[];
    weight: number;
    duration: number;
    steps: Step[];
    distance: number;
    summary: string;
}

interface Step {
    intersections: any[];
    maneuver: Maneuver;
    name: string;
    duration: number;
    distance: number;
    driving_side: string;
    weight: number;
    mode: string;
    geometry: GeometryObject;
    ref?: string;
}

interface Maneuver {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
    location: number[];
    modifier?: string;
    exit?: number;
}

function JourneyControls({
    stops,
    journeyDetails,
    expanded = true,
}: JourneyControlProps) {
    // console.log({ journeyDetails, stops });

    return (
        <div className="flex flex-col items-start gap-3">
            {Array(journeyDetails?.length)
                .fill(0)
                .map((_, i) => {
                    const segment = stops?.[i];
                    const currentJourney = journeyDetails?.[i];

                    return (
                        <ul
                            key={`segment-${i}`}
                            className="flex w-full flex-wrap items-center justify-between gap-5"
                        >
                            {!!segment && !!segment.length && (
                                <li className="flex items-center gap-1">
                                    {segment?.[0]?.name}
                                    <span className="text-2xl">
                                        <FaCaretRight />
                                    </span>
                                    {segment?.[segment.length - 1]?.name}
                                </li>
                            )}
                            {!!currentJourney && (
                                <li>
                                    {Math.round(
                                        currentJourney?.distance / 1000
                                    )}{" "}
                                    KM |{" "}
                                    {Math.round(currentJourney?.duration / 60) *
                                        1}{" "}
                                    Minutes
                                </li>
                            )}
                        </ul>
                    );
                })}

            <button
                className="btn-outline btn-error btn mt-3 w-full px-5"
                onClick={() => Inertia.visit("/")}
            >
                Stop Journey
            </button>
        </div>
    );
}

export default JourneyControls;
