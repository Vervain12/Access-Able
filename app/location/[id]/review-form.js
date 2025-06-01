'use client'
import { FormHelperText, FormControl, InputLabel, Input, TextField, Rating, Box, Button } from "@mui/material";
import { useState, useEffect } from "react"
import { CreateReview } from "@/app/services/review-services";

export default function ReviewForm({ location_id }) {
    const [rating, setRating] = useState(2); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reviewData = {
            location_id: location_id,
            rating: rating,
            review_text: formData.get('review_text')
        }
        await CreateReview(reviewData);
    }
   
    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ width: '25%', height: '25%', color: 'black'}}>
                <TextField
                    name="review_text"
                    id="review_text"
                    label="Write your Review"
                    aria-describedby="review-text-helper-text"
                    multiline
                    fullWidth
                    rows={4}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: 2
                }}>
                    <Rating 
                        name="rating" 
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        defaultValue={2} 
                        size="large" 
                    />
                    <Button
                        variant="contained"
                        style={buttonStyle}
                        type="submit"
                    >Submit</Button>
                </Box>
            </Box>
        </form>
    );
}

const buttonStyle = {
    width: '30%',
    height: '20%',
    padding: '12px 24px',
};