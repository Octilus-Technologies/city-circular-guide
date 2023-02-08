import { getAllStopDetails } from "@/utils/geoJson";
import { geocode, reverseGeocode } from "@/utils/mapbox-api";
import { Inertia } from "@inertiajs/inertia";
import React, { FormEventHandler, useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import AsyncSelect from "react-select/async";

type Area = {
    name: string;
    id?: string;
    coordinates: number[];
    type?: string;
};

type AreaOption = { label: string; value: Area };

const selectClassNames: Parameters<
    typeof AsyncSelect<AreaOption>
>[0]["classNames"] = {
    container: (props) => "",
    control: (props) =>
        "!bg-transparent !border-0 !border-b-[1px] input !rounded-none !border-gray-300 text-xl placeholder:text-gray-300",
    input: (props) => "!flex !text-inherit",
    menu: (props) => "!bg-primary",
    option: (props) =>
        "!text-inherit !bg-transparent hover:!bg-primary hover:!saturate-[110%] text-left",
    singleValue: (props) => "!text-white",
    placeholder: (props) => "!text-gray-300 text-left",
};

function InitialRouteQueryForm({
    accessToken,
    className = "",
    setFromCoords,
    setDestinationCoords,
    ...props
}: {
    accessToken: string;
    className?: string;
    setFromCoords: (coordinates?: number[]) => void;
    setDestinationCoords: (coordinates?: number[]) => void;
} & React.HTMLAttributes<HTMLFormElement>) {
    const geolocation = useGeolocation();

    const [from, setFrom] = useState<AreaOption>();
    const [destination, setDestination] = useState<AreaOption>();

    console.log({ from, destination });

    // * Setting initial location
    useEffect(() => {
        const fetchArea = async () => {
            if (geolocation?.accuracy < 1000) return;

            const data = await reverseGeocode(accessToken, geolocation);
            const area = data?.features?.[1];

            setFrom({
                label: area.place_name,
                value: {
                    name: area.place_name,
                    coordinates: area.center,
                    id: area.id,
                    type: "stop",
                },
            });
        };

        fetchArea();
    }, [geolocation.accuracy]);

    const loadOptions = (
        inputValue: string,
        callback: (options: AreaOption[]) => void
    ) => {
        // Add bus stops to search result
        const busStops = getAllStopDetails(true).filter((stop) =>
            stop.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const busStopOptions = busStops.map((stop) => ({
            label: stop.name,
            value: {
                name: stop.name,
                coordinates: stop.coordinates,
                id: stop.name.replace(/\s/g, "-"),
            },
        }));

        // search
        geocode(accessToken, inputValue).then((areaList) => {
            const filteredList = areaList.features
                .map((f) => ({
                    name: f.place_name,
                    coordinates: f.center,
                    id: f.id,
                }))
                .filter((d) =>
                    (d.name as string).includes("Thiruvananthapuram")
                );

            const areaOptions = filteredList.map((d) => ({
                label: d.name,
                value: {
                    name: d.name,
                    coordinates: d.coordinates,
                    id: d.id,
                    type: "area",
                },
            }));

            const allOptions = [...busStopOptions, ...areaOptions];

            callback(allOptions);
        });
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!from) return;
        if (!destination) return;

        console.log({ from, destination });

        Inertia.post("/journey", {
            from: from.value,
            destination: destination.value,
        } as any); // Inertia type definition bug
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-8 ${className}`}
            {...props}
        >
            {/* <pre>{JSON.stringify(destination, null, 2)}</pre> */}
            <div className="form-control text-white">
                <label
                    className="label flex justify-start gap-3"
                    htmlFor="from"
                >
                    <FaMapMarkerAlt className="mr-1 inline-block text-secondary" />
                    <span className="label-text text-inherit">From?</span>
                </label>

                <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions={from ? [from] : []}
                    defaultValue={from}
                    onChange={(newValue) => {
                        setFromCoords(newValue?.value.coordinates);
                        setFrom(newValue as any);
                    }}
                    classNames={selectClassNames}
                />
            </div>

            <div className="form-control text-white">
                <label
                    className="label flex justify-start gap-3"
                    htmlFor="destination"
                >
                    <FaFlag className="mr-2 inline-block text-secondary" />
                    <span className="label-text text-inherit">Where to?</span>
                </label>

                <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions
                    defaultValue={destination}
                    onChange={(newValue) => {
                        setDestinationCoords(newValue?.value.coordinates);
                        setDestination(newValue as any);
                    }}
                    classNames={selectClassNames}
                />
            </div>

            <div className="form-control">
                <button type="submit" className="btn-primary btn">
                    Find best route
                </button>
            </div>

            {/* <pre className="alert bg-opacity-5 text-left text-white">
                {JSON.stringify({ from, destination }, null, 2)}
            </pre> */}
        </form>
    );
}

export default InitialRouteQueryForm;
