import { GetImages } from "../services/review-services";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import EditReviewPopup from "./edit-review";

export const ReviewComponent = ({ review, location_name, relatedBool }) => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const FetchImagesAndUser = async () => {
      const results = await GetImages(review.review_id);
      setImages(results);

      const supabase = await createClient();
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
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 400,
        height: "fit-content",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {review.user_id === userId && (
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <EditReviewPopup reviewInfo={review} images={images} />
        </Box>
      )}
      
      <CardContent>
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {relatedBool && location_name && `User: ${review.display_name}`}
        </Typography>
        
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {location_name
            ? `Location: ${location_name}`
            : `User: ${review.display_name}`}
        </Typography>
        
        <Rating
          name="rating"
          value={review.rating}
          readOnly
          size="small"
          sx={{ mb: 1 }}
        />
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.6, m: 0 }}>
            {review.review_text}
          </Typography>
          <Box
            component="span"
            sx={{
              cursor: "pointer",
              fontSize: "1.2rem",
              userSelect: "none",
              "&:hover": { opacity: 0.7 },
            }}
            onClick={() => toggleSpeech(review.review_text)}
            aria-label="Read review out loud"
            role="button"
          >
            🔊
          </Box>
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {new Date(review.created_at).toLocaleDateString()}
        </Typography>
        
        {images && images.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: "80px",
                  height: "80px",
                  flexShrink: 0,
                }}
              >
                <img
                  src={image.url}
                  alt={`Review image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
