import { Inertia } from "@inertiajs/inertia";
import { GeometryObject } from "@turf/turf";
import React from "react";
import { FaCaretRight } from "react-icons/fa";
import JourneySteps from "./JourneySteps";

type JourneyControlProps = {
    expanded?: boolean;
    stops?: { coordinates: number[]; name: string }[][];
    journeyDetails?: Journey[];
};

export interface Journey {
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
            <ul className="flex w-full flex-col gap-5">
                {Array(journeyDetails?.length)
                    .fill(0)
                    .map((_, i) => {
                        const segment = stops?.[i];
                        const currentJourney = journeyDetails?.[i];

                        return (
                            <React.Fragment key={`segment-${i}`}>
                                <li className="flex w-full flex-col items-start">
                                    <JourneySteps
                                        segment={segment}
                                        journey={currentJourney}
                                        expanded={true}
                                    />
                                </li>

                                {!!stops && i !== stops.length - 1 && (
                                    <span className="h-[3px] bg-primary" />
                                )}
                            </React.Fragment>
                        );
                    })}
            </ul>

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
