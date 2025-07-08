"use client"
import { Modal, Button, Box, TextField, Rating, CircularProgress, Icon, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import { UpdateReview, DeleteReview, DeleteSpecificImages, UploadImages } from "../services/review-services";
import { Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";

export default function EditReviewPopup({ reviewInfo, images }) {
    const [openModal, setOpen] = useState(false);
    const [openDeleteModal, setOpenDelete] = useState(false);
    const [rating, setRating] = useState(reviewInfo.rating); 
    const [errorMessage, setErrorMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [displayImages, setDisplayImages] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [updating, setUpdating] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleOpenDelete = () => setOpenDelete(true);    
    const handleClose = () => {
        setOpen(false);
        setErrorMessage("");
    };

    useEffect(() => {
        if (images && images.length > 0) {
            const imageDisplay = images.map((image, index) => ({
                url: image.url,
                isExisting: true,
                index: index
            }));
            setDisplayImages(imageDisplay);
        }
    }, [reviewInfo, images]);

    useEffect(() => {
        console.log("New files:", newFiles);
    }, [newFiles])

    const { getRootProps, getInputProps, acceptedFiles, fileRejections, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
        },
        maxFiles: 5, 
        maxSize: 5 * 1024 * 1024, //5MB file size
        onDrop: (acceptedFiles) => {
            setNewFiles(acceptedFiles);

            const newFileDisplay = acceptedFiles.map((file, index) => ({
                url: URL.createObjectURL(file),
                isExisting: false,
                file: file,
                index: files.length + index
            }));
            
            setDisplayImages(prev => [...prev, ...newFileDisplay]);
        }
    });

    const removeImage = (index, isExisting) => {
        if (isExisting) {
            const imageToDelete = images[displayImages[index].index];
            setFilesToDelete(prev => [...prev, imageToDelete]);
            setDisplayImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const displayItem = displayImages[index];
            setFiles(prev => prev.filter(file => file !== displayItem.file));
            setDisplayImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setUpdating(true);
        const formData = new FormData(event.target);

        if (filesToDelete.length > 0) {
            const deleteResult  = await DeleteSpecificImages(filesToDelete);

            if (deleteResult?.error) {
                console.log("There was an error when deleting images.");
                setErrorMessage("There was an error when updating the review.");
            }
        }

        if (newFiles.length > 0) {
            const fileData = new FormData();
            newFiles.forEach((file) => {
                fileData.append('images', file);
            });
            fileData.append('review_id', reviewInfo.review_id);

            const imageResult = await UploadImages(fileData);
            if (imageResult.error) {
                if (imageResult.error === 'CONTENT_POLICY_VIOLATION'){
                    console.log("Image content violates safety guidelines.")
                    setErrorMessage("Image content violates safety guidelines.");
                } else {
                    console.log("There was an error when updating the review images.");
                    setErrorMessage("There was an error when updating the review images.");
                }
                setUpdating(false);
                return;
            }
        } 
        
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
        if (!errorMessage) {
            window.location.reload();            
        }
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
                            
                            {/*Dropzone*/}
                            <div {...getRootProps({className: "dropzone"})} style={{ width: '100%' }}>
                                <input className="input-zone" {...getInputProps()} />
                                <div className="text-center">
                                    <div className="dropzone-content border-2 p-5 border-dashed">
                                        {displayImages.length > 0 ? (
                                            <div className="flex flex-row overflow-x-scroll">
                                                {displayImages.map((image, index) => (
                                                    <div key={index} style={{ position: 'relative', margin: '0 5px' }}>
                                                        <img
                                                            src={image.url}
                                                            alt={`Review image ${index + 1}`}
                                                            style={{
                                                                width: '100px', 
                                                                height: '100px', 
                                                                objectFit: 'cover',
                                                            }} 
                                                        />
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(index, image.isExisting);
                                                            }}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '-5px',
                                                                right: '-8px',
                                                                color: 'error.main',
                                                                width: '24px',
                                                                height: '24px',
                                                            }}
                                                            size="small"
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>Upload your images here!</div>
                                        )}
                                    </div>
                                </div>
                            </div>
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