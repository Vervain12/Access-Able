import { GetImages } from "../services/review-services";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Modal,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import EditReviewPopup from "./edit-review";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

//I'm using location_name as a boolean, its existence signifies if we're on My Reviews or a location page

export const ReviewComponent = ({ review, location_name, relatedBool }) => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const savedTheme = localStorage.getItem("theme");

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatSubmissionDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleOpenModal = (index) => {
    setSelectedImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Why use this when https://mui.com/material-ui/react-tabs/ is an option?
  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const displayMainName = location_name
    ? `Location: ${location_name}`
    : `User: ${review.display_name}`;

  return (
    <Card
      sx={{
        minWidth: 300,
        width: "100%",
        maxWidth: 750,
        height: "fit-content",
        flexShrink: 0,
        boxShadow: 3,
        borderRadius: 2,
        position: "relative",
        p: 0,
        bgcolor: savedTheme === "dark" ? "oklch(0.279 0.041 260.031)" : "white",
        color: savedTheme === "dark" ? "#fefefe" : "black",
      }}
    >
      {review.user_id === userId && (
        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
          <EditReviewPopup reviewInfo={review} images={images} />
        </Box>
      )}

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Avatar
            src={review.profile_picture}
            alt={review.display_name}
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              flexShrink: 0,
              bgcolor: "primary.main",
              fontSize: "1rem",
            }}
          >
            {getInitials(review.display_name)}
          </Avatar>
          <Box>
            <Typography
            variant="subtitle1"
            component="h2"
            sx={{ fontWeight: "bold", gutterBottom: true }}
          >
            {displayMainName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Rating
              name="rating"
              value={review.rating}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" sx={{color: savedTheme === "dark" ? "#fefefe" : "black"}}>
              {formatSubmissionDate(review.created_at)}
            </Typography>
          </Box>
          </Box>
          
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
  <Box sx={{ flexGrow: 1, display: "flex", minWidth: 0, minHeight: 210 }}>
    <Box sx={{ flexGrow: 1, position: "relative", pr: 3 }}>
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
          verticalAlign: "middle",
          mt: 1,
          display: "inline-block",
        }}
        onClick={() => toggleSpeech(review.review_text)}
        aria-label="Read review out loud"
        role="button"
      >
        🔊
      </Box>
    </Box>

    {images && images.length > 0 && (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 96px)",
          gridAutoRows: "96px",
          gap: 1,
          ml: 2,
          flexShrink: 0,
          width: 200,
          minHeight: 200,
        }}
      >
        {images.slice(0, 4).map((image, index) => (
          <Box
            key={index}
            sx={{
              width: 96,
              height: 96,
              overflow: "hidden",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#f0f0f0",
            }}
            onClick={() => handleOpenModal(index)}
          >
            <img
              src={image.url}
              alt={`Review image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {index === 3 && images.length > 4 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  borderRadius: "4px",
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

      {/* Image Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            id="image-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Review Images ({selectedImageIndex + 1} of {images.length})
          </Typography>

          {images.length > 0 && (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                mb: 2,
              }}
            >
              <IconButton
                onClick={handlePrevImage}
                disabled={images.length <= 1}
                sx={{
                  position: "absolute",
                  left: 0,
                  zIndex: 1,
                  bgcolor: "rgba(255,255,255,0.7)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>

              <img
                src={images.at(selectedImageIndex)?.url}
                alt={`Review image ${selectedImageIndex + 1}`}
                style={{
                  maxWidth: "90%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />

              <IconButton
                onClick={handleNextImage}
                disabled={images.length <= 1}
                sx={{
                  position: "absolute",
                  right: 0,
                  zIndex: 1,
                  bgcolor: "rgba(255,255,255,0.7)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
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
