import { geocode, reverseGeocode } from "@/utils/mapbox-api";
import { Inertia } from "@inertiajs/inertia";
import React, { FormEventHandler, useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";

type Area = {
    name: string;
    id: string;
    coordinates: number[];
};

function InitialRouteQueryForm({ accessToken }: { accessToken: string }) {
    const geolocation = useGeolocation();
    const [currentLocation, setCurrentLocation] = useState({});
    const [from, setFrom] = useState<{
        search?: string;
        coordinates?: number[];
    }>();
    const [areaList, setAreaList] = useState<{
        from?: Area[];
        destination?: Area[];
    }>({
        from: [],
        destination: [],
    });
    const [destination, setDestination] = useState<{
        search?: string;
        coordinates?: number[];
    }>();

    useEffect(() => {
        const fetchArea = async () => {
            console.log(geolocation);
            if (geolocation?.accuracy < 1000) return;

            const data = await reverseGeocode(accessToken, geolocation);
            const area = data?.features?.[1];
            console.log(area);

            const location = {
                search: `Current location (${area.text})`,
                coordinates: area.center,
            };

            setCurrentLocation(location);
            setFrom((from) => (!from?.coordinates ? location : from));
            console.log(location);
        };

        fetchArea();
    }, [geolocation.accuracy]);

    useEffect(() => {
        if (
            !from?.search ||
            (from?.search as string).includes("Current location")
        )
            return;

        const updateFromAreaList = async () => {
            const fromAreaList = (
                await geocode(accessToken, from?.search)
            ).features.map((f) => ({
                name: f.place_name,
                coordinates: f.center,
                id: f.id,
            }));
            console.log(fromAreaList);

            if (fromAreaList?.[0]?.name === from?.search) {
                setFrom((from) => ({
                    search: from?.search,
                    coordinates: from?.coordinates,
                }));
            }
            setAreaList((list) => ({
                ...list,
                from: fromAreaList,
            }));
        };

        const handler = setTimeout(() => {
            updateFromAreaList();
        }, 300);

        return () => clearTimeout(handler);
    }, [from?.search]);

    useEffect(() => {
        if (!destination?.search) return;

        const updateDestinationAreaList = async () => {
            let destinationAreaList = (
                await geocode(accessToken, destination?.search)
            ).features.map((f) => ({
                name: f.place_name,
                coordinates: f.center,
                id: f.id,
            }));
            console.log(destinationAreaList);

            if (destinationAreaList?.[0]?.name === destination?.search) {
                setDestination({
                    search: destinationAreaList?.[0]?.name,
                    coordinates: destinationAreaList?.[0]?.coordinates,
                });

                destinationAreaList = [];
            }

            setAreaList((list) => ({
                ...list,
                destination: destinationAreaList,
            }));
        };

        const handler = setTimeout(() => {
            updateDestinationAreaList();
        }, 300);

        return () => clearTimeout(handler);
    }, [destination?.search]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!from) return;
        if (!destination) return;

        Inertia.post("/journey", {
            from,
            destination,
        } as any); // TODO: check the type error
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* <pre>{JSON.stringify(destination, null, 2)}</pre> */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text">From</span>
                </label>
                <input
                    type="text"
                    placeholder="From location"
                    className="input rounded-none border-0 border-b-2 border-white bg-transparent"
                    onChange={(e) =>
                        setFrom((from) => ({ ...from, search: e.target.value }))
                    }
                    value={from?.search ?? ""}
                    list="fromAreaList"
                />
                <datalist id="fromAreaList">
                    {areaList?.from?.map((area) => (
                        <option
                            data-coords={area.coordinates.join(",")}
                            key={area.id}
                            value={area.name}
                        />
                    ))}
                </datalist>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">To</span>
                </label>
                <input
                    type="text"
                    placeholder="To location"
                    className="input rounded-none border-0 border-b-2 border-white bg-transparent"
                    onChange={(e) =>
                        setDestination((destination) => ({
                            ...destination,
                            search: e.target.value,
                        }))
                    }
                    value={destination?.search ?? ""}
                    list="destinationAreaList"
                />
                <datalist id="destinationAreaList">
                    {areaList?.destination?.map((area) => (
                        <option
                            data-coords={area.coordinates.join(",")}
                            key={area.id}
                            value={area.name}
                        />
                    ))}
                </datalist>
            </div>
            <div className="form-control mt-6">
                <button type="submit" className="btn-primary btn">
                    Find best route
                </button>
            </div>
        </form>
    );
}

export default InitialRouteQueryForm;
