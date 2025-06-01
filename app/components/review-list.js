// takes either user_id to find a list of users reviews or location_id to find location reviews
import { useState, useEffect } from "react"
import { GetLocationReviews } from "../services/review-services";
import { Stack, Box, Rating } from "@mui/material";

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
                        <Box key={item.review_id} sx={{display: 'flex', flexDirection: 'column', color: 'black', width: '25%', height: '25%', background: ''}}>
                            <h2>User: {item.display_name}</h2> 
                            <Rating 
                                name="rating" 
                                value={item.rating}
                                readOnly
                                size="large" 
                            />
                            <p>{item.review_text}</p>
                            <p>{new Date(item.created_at).toLocaleDateString()}</p>
                        </Box>
                    ))}
                </Stack>
            </div>}
        </div>
    )
}