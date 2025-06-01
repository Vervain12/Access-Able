import { createClient } from "@/utils/supabase/client"

export async function CreateReview(reviewData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userIdData = {
        user_id: user.id,
        display_name: user.user_metadata.display_name,
        ...reviewData
    };

    const response = await fetch('/api/reviews/location/PostLocationReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userIdData),
    })

    const result = await response.json()

    if (response.ok) {
        console.log('Success:', result.data)
    } else {
        console.error('Error:', result.error)
    }
}

export async function GetLocationReviews(location_id) {

    const response = await fetch(`/api/reviews/location/GetLocationReviews?location_id=${location_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },

    })

    if (!response.ok) {
        console.error('Error fetching reviews:', response.statusText);
        return null;
    }

    const result = await response.json()
    return result.data || [];
}