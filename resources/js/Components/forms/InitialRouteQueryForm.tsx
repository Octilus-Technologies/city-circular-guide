import React, { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";

function InitialRouteQueryForm({ accessToken }) {
    const geolocation = useGeolocation();
    const [area, setArea] = useState({});

    const fetchArea = async () => {
        if (geolocation?.accuracy < 1000) return;
        console.log(geolocation);

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/${"mapbox.places"}/${
                geolocation.longitude
            },${geolocation.latitude}.json?access_token=${accessToken}`
        );
        const data = await response.json();
        setArea(data.features[1]["text"]);
    };

    useEffect(() => {
        fetchArea();
    }, [geolocation.accuracy]);

    return (
        <form action="#">
            <pre>{JSON.stringify(geolocation, null, 2)}</pre>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">From</span>
                </label>
                <input
                    type="text"
                    placeholder="From location"
                    className="input-bordered input"
                    value={area}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">To</span>
                </label>
                <input
                    type="text"
                    placeholder="To location"
                    className="input-bordered input"
                />
            </div>
            <div className="form-control mt-6">
                <button className="btn-primary btn">Find best route</button>
            </div>
        </form>
    );
}

export default InitialRouteQueryForm;
