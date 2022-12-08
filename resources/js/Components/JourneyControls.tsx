import { Inertia } from "@inertiajs/inertia";
import { GeometryObject } from "@turf/turf";
import React from "react";
import { FaCaretRight } from "react-icons/fa";

type JourneyControlProps = {
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

function JourneyControls({ stops, journeyDetails }: JourneyControlProps) {
    // console.log({ journeyDetails, stops });
    const currentStop = stops?.[0];
    const currentJourney = journeyDetails?.[0];
    console.log({ currentStop, currentJourney });

    return (
        <div>
            <ul className="flex flex-wrap items-center gap-3">
                {!!currentStop && !!currentStop.length && (
                    <li className="flex items-center gap-1">
                        {currentStop?.[0]?.name}
                        <span className="text-2xl">
                            <FaCaretRight />
                        </span>
                        {currentStop?.[currentStop.length - 1]?.name}
                    </li>
                )}
                {!!currentJourney && (
                    <li>
                        {Math.round(currentJourney?.distance / 1000)} KM |{" "}
                        {Math.round(currentJourney?.duration / 60) * 1} Minutes
                    </li>
                )}
                <li>
                    <button
                        className="btn-outline btn-error btn px-5"
                        onClick={() => Inertia.visit("/")}
                    >
                        Stop
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default JourneyControls;
