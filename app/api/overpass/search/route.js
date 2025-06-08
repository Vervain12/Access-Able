import getBoundingBox from "../../../components/bounding-box";

export async function POST(req) {
    const { q, distance, userLat, userLon } = await req.json();

    const apiUrl = "https://overpass-api.de/api/interpreter";

    const bbox = getBoundingBox(userLat, userLon, distance);

    const spaceQuery = q.toLowerCase();
    const underscoreQuery = q.toLowerCase().replace(" ", "_");
    
    const query = `
        [out:json][timeout:25];
        (
        node["amenity"="${spaceQuery}"](${bbox});
        node["amenity"="${underscoreQuery}"](${bbox});
        node["name"~"${spaceQuery}",i](${bbox});
        );
        out body;
        `;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `data=${encodeURIComponent(query)}`,
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    }
    catch (e) {
        console.error("Error fetching data: ", e);
    }
}