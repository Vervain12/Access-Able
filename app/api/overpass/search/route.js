import getBoundingBox from "../../../components/bounding-box";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
    const { q, distance, userLat, userLon } = await req.json();
    const supabase = await createClient();
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
        const locationIds = data.elements.map(location => location.id.toString());
        
        const { data: avgRatings, error } = await supabase
            .from('reviews')
            .select('location_id, rating')
            .in('location_id', locationIds);
        
        if (error) throw error;
        
        const ratingMap = new Map();
        if (avgRatings && avgRatings.length > 0) {
            const groupedRatings = avgRatings.reduce((acc, review) => {
                if (!acc[review.location_id]) {
                    acc[review.location_id] = [];
                }
                acc[review.location_id].push(review.rating);
                return acc;
            }, {});
            
            Object.entries(groupedRatings).forEach(([locationId, ratings]) => {
                const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                ratingMap.set(locationId, avg);
            });
        }
        
        const locationsWithRating = data.elements.map(location => ({
            ...location,
            rating: ratingMap.get(location.id.toString()) || null
        }));
        
        return new Response(JSON.stringify({ ...data, elements: locationsWithRating }), { status: 200 });
    }
    catch (e) {
        console.error("Error fetching data: ", e);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
}
