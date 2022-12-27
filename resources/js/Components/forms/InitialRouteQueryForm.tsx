import { geocode, reverseGeocode } from "@/utils/mapbox-api";
import { Inertia } from "@inertiajs/inertia";
import React, { FormEventHandler, useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { FaFlag, FaMapMarkerAlt } from "react-icons/fa";

type Area = {
    name: string;
    id: string;
    coordinates: number[];
};

type AreaSearch = {
    search?: string;
    coordinates?: number[];
};

function InitialRouteQueryForm({
    accessToken,
    className = "",
    ...props
}: {
    accessToken: string;
    className?: string;
}) {
    const geolocation = useGeolocation();
    const [areaList, setAreaList] = useState<{
        from?: Area[];
        destination?: Area[];
    }>({
        from: [],
        destination: [],
    });
    const [from, setFrom] = useState<AreaSearch>();
    const [destination, setDestination] = useState<AreaSearch>();

    const foundExactFromMatch = areaList.from?.some(
        (d) => d.name === from?.search
    );
    const foundExactDestinationMatch = areaList.destination?.some(
        (d) => d.name === destination?.search
    );

    useEffect(() => {
        const fetchArea = async () => {
            if (geolocation?.accuracy < 1000) return;

            const data = await reverseGeocode(accessToken, geolocation);
            const area = data?.features?.[1];
            const location = {
                search: `Current location (${area.text})`,
                coordinates: area.center,
            };

            setFrom((prevFrom) =>
                !prevFrom?.coordinates ? { ...location } : { ...prevFrom }
            );
        };

        fetchArea();
    }, [geolocation.accuracy]);

    const updateAreaList = async (
        type: keyof typeof areaList,
        search?: string
    ) => {
        if (!search) return;

        let areaList = (await geocode(accessToken, search)).features.map(
            (f) => ({
                name: f.place_name,
                coordinates: f.center,
                id: f.id,
            })
        );
        console.log(areaList);

        setAreaList((list) => ({
            ...list,
            [type]: areaList,
        }));

        let match = areaList.find((d) => d.name === search);
        if (!match) return;

        switch (type) {
            case "from":
                setFrom({
                    search: match?.name,
                    coordinates: match?.coordinates,
                });
                break;

            case "destination":
                setDestination({
                    search: match?.name,
                    coordinates: match?.coordinates,
                });
                break;
        }
    };

    // Debounce and update area list
    useEffect(() => {
        const handler = setTimeout(() => {
            updateAreaList("from", from?.search);
        }, 300);

        return () => clearTimeout(handler);
    }, [from?.search]);

    // Debounce and update area list
    useEffect(() => {
        const handler = setTimeout(() => {
            updateAreaList("destination", destination?.search);
        }, 300);

        return () => clearTimeout(handler);
    }, [destination?.search]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!from) return;
        if (!destination) return;

        console.log({ from, destination });

        Inertia.post("/journey", {
            from,
            destination,
        } as any); // TODO: check the type error
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
                <input
                    id="from"
                    type="text"
                    placeholder="From location"
                    className="input rounded-none border-0 border-b-[1px] border-gray-300 bg-transparent"
                    onChange={(e) =>
                        setFrom((oldFrom) => ({
                            ...oldFrom,
                            search: e.target.value,
                        }))
                    }
                    value={from?.search ?? ""}
                    list="fromAreaList"
                    autoComplete="off"
                />

                <datalist id="fromAreaList">
                    {!foundExactFromMatch &&
                        areaList?.from?.map((area) => (
                            <option
                                data-coords={area.coordinates.join(",")}
                                key={area.id}
                                value={area.name}
                            />
                        ))}
                </datalist>
            </div>

            <div className="form-control text-white">
                <label
                    className="label flex justify-start gap-3"
                    htmlFor="destination"
                >
                    <FaFlag className="mr-2 inline-block text-secondary" />
                    <span className="label-text text-inherit">Where to?</span>
                </label>
                <input
                    id="destination"
                    type="text"
                    placeholder="To location"
                    className="input rounded-none border-0 border-b-[1px] border-gray-300 bg-transparent text-xl placeholder:text-gray-300"
                    onChange={(e) =>
                        setDestination((oldDestination) => ({
                            ...oldDestination,
                            search: e.target.value,
                        }))
                    }
                    value={destination?.search ?? ""}
                    list="destinationAreaList"
                    autoComplete="off"
                />

                <datalist id="destinationAreaList">
                    {!foundExactDestinationMatch &&
                        areaList?.destination?.map((area) => (
                            <option
                                data-coords={area.coordinates.join(",")}
                                key={area.id}
                                value={area.name}
                            />
                        ))}
                </datalist>
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
