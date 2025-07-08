import { createClient } from "@/utils/supabase/client"

export async function GetRecommendedPlaces() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const response = await fetch(`/api/overpass/GetSuggestedPlaces?user_id=${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        console.error('Error fetching locations:', response.statusText);
        return null;
    }

    const result = await response.json();
    return result.data || [];
}