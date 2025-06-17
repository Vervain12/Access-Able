import { GetImages } from "../services/review-services"
import { Box, Button, Card, CardContent, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { Rating } from "@mui/material"
import { createClient } from "@/utils/supabase/client"
import EditReviewPopup from "./edit-review"

export const ReviewComponent = ({ review, location_name }) => {
   const [images, setImages] = useState([]);
   const [userId, setUserId] = useState("");
   
   useEffect(() => {
        const FetchImagesAndUser = async () => {
            const results = await GetImages(review.review_id);
            setImages(results);

            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id);
       }
       FetchImagesAndUser();
   },[review]);

   return (
       <Card sx={{ 
           minWidth: 300, 
           maxWidth: 400, 
           height: 'fit-content',
           flexShrink: 0 
       }}>
           <CardContent>
               <Typography variant="subtitle1" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                   {location_name ? `Location: ${location_name}` : `User: ${review.display_name}`}
               </Typography>
               
               <Rating
                   name="rating"
                   value={review.rating}
                   readOnly
                   size="small"
                   sx={{ mb: 1 }}
               />
               
               <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                   {review.review_text}
               </Typography>
               
               <Typography variant="caption" color="text.secondary">
                   {new Date(review.created_at).toLocaleDateString()}
               </Typography>
               
               {images && images.length > 0 && (
                   <Box sx={{ mt: 2 }}>
                       {images.map((image, index) => (
                           <img
                               key={index}
                               src={image.url}
                               alt={`Review image ${index + 1}`}
                               style={{
                                   width: '100%',
                                   maxHeight: '200px',
                                   objectFit: 'cover',
                                   borderRadius: '4px',
                                   marginBottom: '8px'
                               }}
                           />
                       ))}
                   </Box>
               )}
           </CardContent>
           {review.user_id === userId && (
                <EditReviewPopup reviewInfo={review} images={images}/>
           )}
       </Card>
   )
}