import { GetImages } from "../services/review-services"
import { Box } from "@mui/material"
import { useState, useEffect } from "react"
import { Rating } from "@mui/material"

export const ReviewComponent = ({ review }) => {
    const [images, setImages] = useState([]);
   
    useEffect(() => {
        const FetchImages = async () => {
            const results = await GetImages(review.review_id);
            setImages(results);
        }
        FetchImages();
        console.log(images);
    },[review]);
     
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', color: 'black', width: '25%', height: '25%', background: ''}}>
            <h2>User: {review.display_name}</h2>
            <Rating
                name="rating"
                value={review.rating}
                readOnly
                size="large"
            />
            <p>{review.review_text}</p>
            <p>{new Date(review.created_at).toLocaleDateString()}</p>
            {images && images.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {images.map((image, index) => (
                        <img 
                            key={index}
                            src={image.url}
                            alt={`Review image ${index + 1}`}
                            style={{
                                maxWidth: '300px',
                                maxHeight: '300px', // Depending on how it works this may need to be modified later
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
     )
}