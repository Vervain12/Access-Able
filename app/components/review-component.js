import { GetImages } from "../services/review-services";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import EditReviewPopup from "./edit-review";

export const ReviewComponent = ({ review, location_name, relatedBool }) => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("");

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

  // TTS  using native Web Speech API
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 400,
        height: "fit-content",
        flexShrink: 0,
      }}
    >
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

        {/*  Review text + speaker button */}
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
            onClick={() => speakText(review.review_text)}
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
          <Box sx={{ mt: 2 }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Review image ${index + 1}`}
                style={{
                  width: "auto",
                  maxHeight: "200px",
                  maxWidth: "100%",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>

      {review.user_id === userId && (
        <EditReviewPopup reviewInfo={review} images={images} />
      )}
    </Card>
  );
};
