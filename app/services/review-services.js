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
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Review Success:', result.data);
    } else {
        console.error('Review Error:', result.error);
        throw new Error(result.error);
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

    const result = await response.json();
    return result.data || [];
}

export async function UploadImages(data) {
    const response = await fetch('/api/reviews/location/UploadReviewImages', {
        method: 'POST',
        body: data
    });
    
    const result = await response.json();

    if (response.ok) {
        console.log('Image Upload Success:', result.data);
    } else {
        console.error('Image Upload Error:', result.error);
        throw new Error(result.error);
    }
}

export async function GetImages(review_id) {
    const response = await fetch(`/api/reviews/location/GetReviewImages?review_id=${review_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        console.error('Error fetching review images:', response.statusText);
        return null;
    }

    const result = await response.json();
    return result || [];
}