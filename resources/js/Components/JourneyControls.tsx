import { Inertia } from "@inertiajs/inertia";
import { GeometryObject } from "@turf/turf";
import React from "react";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import JourneySteps from "./JourneySteps";

type JourneyControlProps = {
    expanded?: boolean;
    stops?: { coordinates: number[]; name: string }[][];
    journeyDetails?: JourneyDetails[];
    journey?: any;
};

export interface JourneyDetails {
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
    journey,
    journeyDetails,
    expanded = true,
}: JourneyControlProps) {
    const from = stops?.[0]?.[0];
    const destination =
        stops?.[stops?.length - 1]?.[stops?.[stops?.length - 1].length - 1];

    return (
        <div className="flex flex-col items-start gap-3">
            <div className="align-center relative flex w-full justify-between pt-4 pb-2 text-sm font-bold">
                <span className="flex w-[25%] items-center justify-center gap-1">
                    <FaMapMarkerAlt className="mr-1 inline-block text-xl text-secondary" />
                    {(journey.from?.name as string).split(",")[0]}
                </span>

                <div className="relative mx-4 flex flex-1 items-center justify-center">
                    <span className="absolute top-[50%] left-0 right-0 -z-[1] translate-y-[-50%] border-0 border-t-2 border-dashed opacity-40"></span>
                    <span className="grid h-[30px] w-[30px] place-content-center rounded-full bg-secondary text-primary shadow-lg">
                        to
                    </span>
                </div>

                <span className="flex w-[25%] items-center justify-center gap-1">
                    <FaFlag className="mr-1 inline-block text-xl text-secondary" />
                    {(journey.destination?.name as string).split(",")[0]}
                </span>
            </div>

            <hr className="mb-4 w-full bg-white opacity-50" />

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
