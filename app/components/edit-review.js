"use client"
import { Modal, Button, Box, TextField, Rating, CircularProgress } from "@mui/material";
import { useState } from "react";
import { UpdateReview } from "../services/review-services";

export default function EditReviewPopup({ reviewInfo, images }) {
    const [openModal, setOpen] = useState(false);
    const [rating, setRating] = useState(reviewInfo.rating); 
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (event) => {
        event.preventDefault();
        setUpdating(true);
        const formData = new FormData(event.target);
        const reviewData = {
            review_id: reviewInfo.review_id,
            rating: rating,
            review_text: formData.get('review_text'),
        }
        const result = await UpdateReview(reviewData);

        handleClose();
        setUpdating(false);
    }

    const handleImages = async () => {

    }

    return (
        <div>
            <Button onClick={handleOpen} variant="contained">Edit Review</Button>

            <Modal 
                open={openModal}
                onClose={handleClose}
                aria-labelledby="edit-review">
                <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    color: 'black'
                }}>
                    <form onSubmit={handleUpdate}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            marginBottom: 2
                        }}>
                            <TextField
                                name="review_text"
                                id="review_text"
                                label="Edit your review"
                                aria-describedby="review-text-helper-text"
                                defaultValue={reviewInfo.review_text}
                                multiline
                                fullWidth
                                rows={4}
                            /> 
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            marginBottom: 2
                        }}>
                            <Rating 
                                name="rating" 
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue)}
                                size="large" 
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                sx={buttonStyle}
                            >Save</Button>
                        </Box>
                    </form>
                    
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
                </Box>
            </Modal>

            {/*Playing around with modals, I'll probably change this later*/}
            {updating && (
                <Modal open={updating}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: 'white',
                        p: 4,
                        borderRadius: 2
                    }}>
                        <CircularProgress />
                        <div>Updating...</div>
                    </Box>
                </Modal>
            )}
        </div>
    )
}

const buttonStyle = {
    width: '30%',
    height: '20%',
    padding: '12px 24px',
};