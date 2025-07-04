"use client"
import { Modal, Button, Box, TextField, Rating, CircularProgress, Icon } from "@mui/material";
import { useState } from "react";
import { UpdateReview } from "../services/review-services";
import { DeleteReview } from "../services/review-services";
import { Stack } from "@mui/material";

export default function EditReviewPopup({ reviewInfo, images }) {
    const [openModal, setOpen] = useState(false);
    const [openDeleteModal, setOpenDelete] = useState(false);
    const [rating, setRating] = useState(reviewInfo.rating); 
    const [errorMessage, setErrorMessage] = useState("");
    const handleClose = () => {
        setOpen(false);
        setErrorMessage("");
    };
    const handleOpen = () => setOpen(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleOpenDelete = () => setOpenDelete(true);    
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (event) => {
        event.preventDefault();
        setUpdating(true);
        const formData = new FormData(event.target);
        
        const reviewText = formData.get('review_text');
        if (!reviewText || !rating) {
            setErrorMessage("Text and rating must be input to update a review.");
            setUpdating(false);
            return;
        }
        
        const reviewData = {
            review_id: reviewInfo.review_id,
            rating: rating,
            review_text: formData.get('review_text'),
        }
        const result = await UpdateReview(reviewData);

        if (result.error) {
            if (result.error === 'CONTENT_POLICY_VIOLATION'){
                console.log("Content violates safety guidelines.")
                setErrorMessage("Content violates safety guidelines.");
            } else {
                console.log("There was an error when updating the review.");
                setErrorMessage("There was an error when updating the review.");
            }
            setUpdating(false);
            return;
        }

        handleClose();
        setUpdating(false);
    }

    const handleImages = async () => {

    }

    const handleDelete = async () => {
        try{
            await DeleteReview({ review_id: reviewInfo.review_id });
            window.location.reload();            
        } catch (error) {
            console.error(error);
        }
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
                        </Box>
                        
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            marginBottom: 2
                        }}>
                            <Button
                                variant="contained"
                                type="button"
                                sx={buttonStyle}
                                onClick={handleOpenDelete}
                            >Delete</Button>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={buttonStyle}
                            >Save</Button>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <p style={errorStyle}>
                                {errorMessage}
                            </p>
                        </Box>
                    </form>
                    
                    {images && images.length > 0 && (
                        <Box sx={{ 
                            mt: 2,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 1
                        }}>
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: '100%',
                                        height: '120px',
                                        overflow: 'hidden',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Review image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Modal>

            <Modal open={openDeleteModal}>
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
                        <h2 style={headingStyle}>Are you sure you want to delete this review?</h2>
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                            <Button onClick={handleCloseDelete} variant="contained">No</Button>
                            <Button onClick={handleDelete} variant="contained">Yes</Button>
                        </Stack>
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

const headingStyle = {
    color: 'black',
    fontSize: '1.1rem', 
    fontWeight: '600', 
};

const errorStyle = {
    color: 'red',
};