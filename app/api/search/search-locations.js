import getBoundingBox from "./bounding-box";

export const QueryLocation = async (q, distance, userLat, userLon) => {
    const apiUrl = "https://overpass-api.de/api/interpreter";

    const bbox = getBoundingBox(userLat, userLon, distance);
    
    const query = `
        [out:json][timeout:25];
        (
        nwr["amenity"="${q}"](${bbox});
        );
        out geom;
        >;`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
              body: `data=${encodeURIComponent(query)}`,
        });

        const data = await response.json();
        return data;
    }
    catch (e) {
        console.error("Error fetching data: ", e);
    }
}