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
        return result;
    } else {
        console.error('Review Error:', result.error);
        return result;
    }

}

export async function DeleteReview({ review_id }) {
    const response = await fetch(`/api/reviews/user/DeleteReview?review_id=${review_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Review Deletion Success:', result.data);
    } else {
        console.error('Review Deletion Error:', result.error);
    }
    return result;
}

export async function UpdateReview(reviewData) {

    const response = await fetch('/api/reviews/user/EditUserReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Review Modified Successfully:', result.data);
    } else {
        console.error('Review Modify Error:', result.error);
    }
    return result;
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

export async function GetUserReviews(user_id) {

    const response = await fetch(`/api/reviews/user/GetUserReviews?user_id=${user_id}`, {
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

export async function getRelatedReviews(user_id) {
    const response = await fetch(`/api/reviews/user/GetRelatedReviews?user_id=${user_id}`, {
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
        console.log('Review Success:', result.data);
        return result;
    } else {
        console.error('Review Error:', result.error);
        return result;
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

export async function DeleteSpecificImages(images) {
    const response = await fetch('/api/reviews/user/DeleteImages', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
    });

    if (!response.ok) {
        console.error('Error deleting images:', response.statusText);
        return null;
    }

    const result = await response.json();
    return result || [];
}