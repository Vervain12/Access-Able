import { useState, useEffect } from "react"
import { GetLocationReviews } from "../services/review-services";
import { Stack, Box, Rating } from "@mui/material";
import { ReviewComponent } from "./review-component";

export default function ReviewList({ location_id }) {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchLocationReviews = async () => {
            try {
                const result = await GetLocationReviews(location_id);
                setReviews(result);
                setLoading(false);
                console.log(result);
            } catch {
                console.log("An error has occured when attempting to fetch location reviews.")
            }
        }
        fetchLocationReviews();
    },[location_id])

    return (
        <div>
            {loading ? 
            <div>Reviews loading...</div> :
            <div>
                <Stack spacing={2}>
                    {reviews.map(item => (
                        <ReviewComponent key={item.review_id} review={item} />
                    ))}
                </Stack>
            </div>}
        </div>
    )
}