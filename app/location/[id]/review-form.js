'use client'
import { FormHelperText, FormControl, InputLabel, Input, TextField, Rating, Box, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react"
import { CreateReview } from "@/app/services/review-services";
import { useDropzone } from "react-dropzone";
import { UploadImages } from "@/app/services/review-services";

// Notes: Currently the submit button is disabled when users already have a review

export default function ReviewForm({ location_id, location_name, hasReview }) {
    const [rating, setRating] = useState(null); 
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpen = () => setOpen(true);
        const handleClose = () => {
        setOpen(false);
        setErrorMessage("");
        setFiles([]);
        setRating(null);
    };

    const { getRootProps, getInputProps, acceptedFiles, fileRejections, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
        },
        maxFiles: 5, 
        maxSize: 5 * 1024 * 1024, //5MB file size
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles);
            console.log(files);
        }
    });

    //Add location name and lat/lon to this. lat/lon is an object
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reviewId = Math.floor(100000 + Math.random() * 900000);

        const reviewText = formData.get('review_text');
        if (!reviewText || !rating) {
            setErrorMessage("Text and rating must be input to create a review.");
            return;
        }

        const reviewData = {
            review_id: reviewId,
            location_id: location_id,
            rating: rating,
            review_text: formData.get('review_text'),
            location_name: location_name
        }
        const result = await CreateReview(reviewData);

        if (result.error) {
            if (result.error === 'DUPLICATE_REVIEW'){
                console.log("You already have a review for this location.");
            } else {
                console.log("There was an error when submitting a review.");
            }
            setErrorMessage("");
            return;
        }

        if (files.length > 0 && reviewId) {
            const fileData = new FormData();
            files.forEach((file) => {
                fileData.append('images', file);
            });
            fileData.append('review_id', reviewId);

            await UploadImages(fileData);
        } else {
            const errorMessage = result.error.toLowerCase();
            console.log(errorMessage);
        }
        setErrorMessage("");
        window.location.reload();
    }
   
    return (
        <>
            <Button variant="contained" onClick={handleOpen} disabled={hasReview}>
                Create Review
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
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
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ width: '100%', height: '100%', color: 'black'}}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                marginTop: 2
                            }}>
                                <TextField
                                    name="review_text"
                                    id="review_text"
                                    label="Write your Review"
                                    aria-describedby="review-text-helper-text"
                                    multiline
                                    fullWidth
                                    rows={4}
                                /> 
                                {/*Dropzone*/}
                                <div {...getRootProps({className: "dropzone"})}>
                                    <input className="input-zone" {...getInputProps()} />
                                    <div className="text-center">
                                        <div className="dropzone-content border-2 p-5 border-dashed">
                                            {files.length > 0 ? (
                                                <div className="flex flex-row overflow-x-scroll">
                                                    {files.map((file, index) => (
                                                        <img
                                                            key={index}
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            style={{
                                                                width: '100px', 
                                                                height: '100px', 
                                                                objectFit: 'cover',
                                                            }} 
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div>Upload your files here!</div>
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
                                    disabled={hasReview}
                                >Submit</Button>
                                <p style={errorStyle}>
                                    {errorMessage}
                                </p>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

const buttonStyle = {
    width: '30%',
    height: '20%',
    padding: '12px 24px',
};

const errorStyle = {
    color: 'red',
    
}