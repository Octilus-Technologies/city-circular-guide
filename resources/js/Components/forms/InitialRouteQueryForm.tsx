import { geocode, reverseGeocode } from "@/utils/mapbox-api";
import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";

function InitialRouteQueryForm({ accessToken }) {
    const geolocation = useGeolocation();
    const [currentLocation, setCurrentLocation] = useState({});
    const [from, setFrom] = useState({});
    const [areaList, setAreaList] = useState({
        from: [],
        destination: [],
    });
    const [destination, setDestination] = useState({});

    useEffect(() => {
        const fetchArea = async () => {
            // console.log(geolocation);
            if (geolocation?.accuracy < 1000) return;

            const data = await reverseGeocode(accessToken, geolocation);
            const area = data?.features?.[1];
            console.log(area);

            const location = {
                search: `Current location (${area.text})`,
                coordinates: area.center,
            };

            setCurrentLocation(location);
            setFrom((from) => (!from.coordinates ? location : from));
            console.log(location);
        };

        fetchArea();
    }, [geolocation.accuracy]);

    useEffect(() => {
        const updateFromAreaList = async () => {
            if (
                !from.search ||
                (from.search as string).includes("Current location")
            )
                return;

            const fromAreaList = (
                await geocode(accessToken, from.search)
            ).features.map((f) => ({
                name: f.place_name,
                coordinates: f.center,
                id: f.id,
            }));
            console.log(fromAreaList);
            setAreaList((list) => ({ ...list, from: fromAreaList }));
        };

        const handler = setTimeout(() => {
            updateFromAreaList();
        }, 300);

        return () => clearTimeout(handler);
    }, [from.search]);

    useEffect(() => {
        const updateDestinationAreaList = async () => {
            if (
                !destination.search ||
                (destination.search as string).includes("Current location")
            )
                return;

            const destinationAreaList = (
                await geocode(accessToken, destination.search)
            ).features.map((f) => ({
                name: f.place_name,
                coordinates: f.center,
                id: f.id,
            }));
            console.log(destinationAreaList);
            setAreaList((list) => ({
                ...list,
                destination: destinationAreaList,
            }));
        };

        const handler = setTimeout(() => {
            updateDestinationAreaList();
        }, 300);

        return () => clearTimeout(handler);
    }, [destination.search]);

    return (
        <form action="#">
            {/* <pre>{JSON.stringify(geolocation, null, 2)}</pre> */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text">From</span>
                </label>
                <input
                    type="text"
                    placeholder="From location"
                    className="input-bordered input"
                    onChange={(e) =>
                        setFrom((from) => ({ ...from, search: e.target.value }))
                    }
                    value={from?.search ?? ""}
                    list="fromAreaList"
                />
                {areaList.from?.[0]?.name !== from.search && (
                    <datalist id="fromAreaList">
                        {areaList.from.map((area) => (
                            <option
                                coords={area.coordinates}
                                key={area.id}
                                value={area.name}
                            />
                        ))}
                    </datalist>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">To</span>
                </label>
                <input
                    type="text"
                    placeholder="To location"
                    className="input-bordered input"
                    onChange={(e) =>
                        setDestination((destination) => ({
                            ...destination,
                            search: e.target.value,
                        }))
                    }
                    value={destination?.search ?? ""}
                    list="destinationAreaList"
                />
                {areaList.destination?.[0]?.name !== destination.search && (
                    <datalist id="destinationAreaList">
                        {areaList.destination.map((area) => (
                            <option
                                coords={area.coordinates}
                                key={area.id}
                                value={area.name}
                            />
                        ))}
                    </datalist>
                )}
            </div>
            <div className="form-control mt-6">
                <button className="btn-primary btn">Find best route</button>
            </div>
        </form>
    );
}

export default InitialRouteQueryForm;
