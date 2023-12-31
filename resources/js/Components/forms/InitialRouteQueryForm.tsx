import { getAllStopDetails } from "@/utils/geoJson";
import { geocode, reverseGeocode } from "@/utils/mapbox-api";
import { router } from "@inertiajs/react";
import Fuse from "fuse.js";
import React, { FormEventHandler, useCallback, useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";
import AsyncSelect from "react-select/async";

const CITY = "Thiruvananthapuram";

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

    const fuzzyMatch = (a: string, b: string) => {
        const fuse = new Fuse([a], {
            minMatchCharLength: 3,
        });

        const result = fuse.search(b);
        return result.length > 0;
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: AreaOption[]) => void
    ) => {
        // Add bus stops to search result
        const busStops = new Fuse(getAllStopDetails(true), {
            keys: ["name"],
            minMatchCharLength: 3,
            shouldSort: true,
        }).search(inputValue);
        const busStopOptions = busStops.map(({ item }) => ({
            label: item.name,
            value: {
                name: item.name,
                coordinates: item.coordinates,
                id: item.name.replace(/\s/g, "-"),
            },
        }));

        // search via map api
        const adjustedInputValue = !fuzzyMatch(CITY, inputValue)
            ? `${inputValue}, ${CITY}` // forcing to search with city name
            : inputValue;
        geocode(accessToken, adjustedInputValue).then((areaList) => {
            const filteredList = areaList.features
                .map((f) => ({
                    name: f.place_name,
                    coordinates: f.center,
                    id: f.id,
                }))
                .filter((d) => (d.name as string).includes(CITY));

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

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();
        if (!from) return;
        if (!destination) return;

        console.log({ from, destination });

        router.post("/journey", {
            from: from.value,
            destination: destination.value,
        } as any); // Inertia type definition bug
    }, [from, destination])

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
