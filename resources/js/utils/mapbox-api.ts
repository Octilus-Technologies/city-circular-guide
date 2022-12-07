type Profile = "driving-traffic" | "driving" | "walking" | "cycling";

export async function getMatch(
    accessToken: string,
    coordinates: number[][],
    radius: number[] | null = null,
    profile: Profile = "driving"
) {
    const coordinatesStr = coordinates.map((c) => c.join(",")).join(";");
    const params: Record<string, string> = {
        geometries: "geojson",
        steps: "true",
        tidy: "false",
        waypoints: `0;${coordinates.length - 1}`,
        access_token: accessToken,
    };

    if (radius) {
        params["radiuses"] = radius.join(";");
    }

    let url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinatesStr}?${new URLSearchParams(
        params
    ).toString()}`;
    const query = await fetch(url, { method: "GET" });
    const response = await query.json();

    if (response.code !== "Ok") {
        console.log(
            `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
        );
        return;
    }

    // console.log(response.matchings);

    // Get the coordinates from the response
    const coords = response.matchings?.[0].geometry;
    return { geometry: coords, journey: response.matchings?.[0].legs?.[0] };
}

export const geocode = async (accessToken, searchText) => {
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/${"mapbox.places"}/${searchText}.json?access_token=${accessToken}`
    );
    const data = (await response.json()) as { features: any[] };

    return data;
};

export const reverseGeocode = async (accessToken, geocode) => {
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/${"mapbox.places"}/${
            geocode.longitude
        },${geocode.latitude}.json?access_token=${accessToken}`
    );
    const data = (await response.json()) as { features: any[] };

    return data;
};
