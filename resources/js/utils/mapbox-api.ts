export type Profile = "driving-traffic" | "driving" | "walking" | "cycling";

const GEOCODING_API = "https://api.mapbox.com/geocoding/v5";
const MATCHING_API = "https://api.mapbox.com/matching/v5";

export async function getMatch(
    accessToken: string,
    coordinates: number[][],
    profile: Profile = "driving",
    radius: number[] | null = null
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

    // API is not giving walking directions (sticking to driving)
    let url = `${MATCHING_API}/mapbox/${"driving"}/${coordinatesStr}?${new URLSearchParams(
        params
    ).toString()}`;
    const query = await fetch(url, { method: "GET" });
    const response = await query.json();

    if (response.code !== "Ok") {
        console.log(`${response.code} - ${response.message}.`);
        return;
    }

    // Get the coordinates from the response
    const geometry = response.matchings?.[0].geometry;
    const journey = response.matchings?.[0].legs?.[0];

    return { geometry, journey, profile };
}

export const geocode = async (accessToken: string, searchText: string) => {
    const response = await fetch(
        `${GEOCODING_API}/${"mapbox.places"}/${searchText}.json?access_token=${accessToken}`
    );
    const data = (await response.json()) as { features: Record<string, any>[] };

    return data;
};

export const reverseGeocode = async (
    accessToken: string,
    geocode: { longitude: number; latitude: number }
) => {
    const response = await fetch(
        `${GEOCODING_API}/${"mapbox.places"}/${geocode.longitude},${
            geocode.latitude
        }.json?access_token=${accessToken}`
    );
    const data = (await response.json()) as { features: Record<string, any>[] };

    return data;
};
