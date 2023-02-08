import useCirculars from "@/utils/hooks/useCirculars";
import React from "react";

type CircularFilterProps = Pick<
    ReturnType<typeof useCirculars>,
    "circulars" | "isAllActive" | "toggleCircularPath"
>;

function CircularFilter({
    circulars,
    toggleCircularPath,
    isAllActive,
}: CircularFilterProps) {
    return (
        <ul className="tab tabs-boxed absolute left-0 top-0 z-10 my-3 flex h-auto flex-wrap gap-2 bg-opacity-60 font-bold opacity-90 transition-all md:left-[40vw]">
            <li key={`circular-all`}>
                <button
                    onClick={() => toggleCircularPath()}
                    className={`tab tab-active !px-4 !py-1 text-xs capitalize transition-all ${
                        isAllActive ? "tab-active" : "opacity-50"
                    }`}
                >
                    All
                </button>
            </li>
            {circulars.map((circular) => (
                <li key={`circular-${circular.id}`}>
                    <button
                        onClick={() => toggleCircularPath(circular.id)}
                        className={`tab tab-active !px-2 !py-1 text-xs capitalize transition-all ${
                            circular.isActive ? "tab-active" : "opacity-50"
                        }`}
                        style={{
                            backgroundColor: circular.color,
                        }}
                    >
                        {circular.name.replace("_", " ")}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default CircularFilter;
