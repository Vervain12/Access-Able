'use client'
import { FormHelperText, FormControl, InputLabel, Input, TextField, Rating, Box, Button } from "@mui/material";
import { useState, useEffect } from "react"
import { CreateReview } from "@/app/services/review-services";
import { useDropzone } from "react-dropzone";
import { UploadImages } from "@/app/services/review-services";

export default function ReviewForm({ location_id }) {
    const [rating, setRating] = useState(2); 
    const [files, setFiles] = useState([]);
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


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reviewId = Math.floor(100000 + Math.random() * 900000);
        const reviewData = {
            review_id: reviewId,
            location_id: location_id,
            rating: rating,
            review_text: formData.get('review_text')
        }
        await CreateReview(reviewData);

        if (files.length > 0 && reviewId) {
            const fileData = new FormData();
            files.forEach((file) => {
                fileData.append('images', file);
            });
            fileData.append('review_id', reviewId);

            await UploadImages(fileData);
        }

    }
   
    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ width: '25%', height: '25%', color: 'black'}}>
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
                                    <div className="flex flex-row">
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