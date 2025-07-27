// components/review-component.js
import { GetImages } from "../services/review-services";
import { Box, Button, Card, CardContent, Typography, Modal, Avatar, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import EditReviewPopup from "./edit-review";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export const ReviewComponent = ({ review, location_name, relatedBool }) => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const FetchImagesAndUser = async () => {
      if (review.images && review.images.length > 0) {
        setImages(review.images);
      } else {
        const results = await GetImages(review.review_id);
        setImages(results);
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    FetchImagesAndUser();
  }, [review]);

  const toggleSpeech = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.pitch = 0.8;
      utterance.rate = 0.9;
      utterance.volume = 0.5;

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenModal = (index) => {
    setSelectedImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeDifference = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffSeconds = Math.ceil(diffTime / 1000);
    const diffMinutes = Math.ceil(diffSeconds / 60);
    const diffHours = Math.ceil(diffMinutes / 60);
    const diffDays = Math.ceil(diffHours / 24);
    const diffWeeks = Math.ceil(diffDays / 7);
    const diffMonths = Math.ceil(diffDays / 30.44);
    const diffYears = Math.ceil(diffDays / 365.25);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return "1 week ago";
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
    if (diffMonths === 1) return "1 month ago";
    if (diffMonths < 12) return `${diffMonths} months ago`;
    if (diffYears === 1) return "1 year ago";
    return `${diffYears} years ago`;
  };

  const displayMainName = location_name || review.display_name;

  return (
    <Card
      sx={{
        minWidth: 300,
        width: '100%',
        maxWidth: 750,
        height: "fit-content",
        flexShrink: 0,
        boxShadow: 3,
        borderRadius: 2,
        position: 'relative',
      }}
    >
      
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}> 
        
        {review.user_id === userId && (
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}> {/* Keep absolute for now */}
            <EditReviewPopup reviewInfo={review} images={images} />
          </Box>
        )}

        {/* Header Section: Location Name, Rating, Time Ago */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              {displayMainName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                name="rating"
                value={review.rating}
                readOnly
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatTimeDifference(review.created_at)}
              </Typography>
            </Box>
          </Box>
        </Box>

        
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>

          
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main', fontSize: '1rem', flexShrink: 0 }}>
            {getInitials(review.display_name)}
          </Avatar>

          {/* Content Area  */}
          <Box sx={{ flexGrow: 1, display: 'flex' }}>

            {/* */}
            {/* */}
            <Box sx={{ flexGrow: 1, position: 'relative', minWidth: '0' }}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                }}
              >
                {review.review_text}
                <Box
                  component="span"
                  sx={{
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    userSelect: "none",
                    "&:hover": { opacity: 0.7 },
                    ml: 1,
                    verticalAlign: 'middle',
                  }}
                  onClick={() => toggleSpeech(review.review_text)}
                  aria-label="Read review out loud"
                  role="button"
                >
                  🔊
                </Box>
              </Typography>
            </Box>

            {/* Image Grid (Right part of content area) */}
            {images && images.length > 0 && (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 96px)',
                gap: 1, // 8px
                ml: 2, // 
                flexShrink: 0,
                width: '200px', 
                
              }}>
                {images.slice(0, 4).map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 96,
                      height: 96,
                      overflow: 'hidden',
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0',
                      cursor: "pointer",
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: '#f0f0f0',
                    }}
                    onClick={() => handleOpenModal(index)}
                  >
                    <img
                      src={images.at(index)?.url}
                      alt={`Review image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: 'cover',
                      }}
                    />
                    {index === 3 && images.length > 4 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                        }}
                      >
                        +{images.length - 4} more
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>

      {/* Image Modal  */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 900,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography id="image-modal-title" variant="h6" component="h2" gutterBottom>
            Review Images ({selectedImageIndex + 1} of {images.length})
          </Typography>

          {images.length > 0 && (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <IconButton
                onClick={handlePrevImage}
                disabled={images.length <= 1}
                sx={{
                  position: 'absolute',
                  left: 0,
                  zIndex: 1,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>

              <img
                src={images.at(selectedImageIndex)?.url}
                alt={`Review image ${selectedImageIndex + 1}`}
                style={{
                  maxWidth: '90%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />

              <IconButton
                onClick={handleNextImage}
                disabled={images.length <= 1}
                sx={{
                  position: 'absolute',
                  right: 0,
                  zIndex: 1,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          )}

          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </Card>
  );
};