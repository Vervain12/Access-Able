import { useState, useEffect } from "react";
import {
  GetLocationReviews,
  GetUserReviews,
  getRelatedReviews,
} from "../services/review-services";
import {
  Stack,
  Box,
  Rating,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ReviewComponent } from "./review-component";
import { createClient } from "@/utils/supabase/client";

export function ReviewList({ location_id, setHasReview }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchLocationReviews = async () => {
      try {
        const result = await GetLocationReviews(location_id);
        setReviews(result);

        // Checking if the user has a review already
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && result.some((e) => e.user_id === user.id)) {
          setHasReview(true);
        } else if (!user) {
          // Locking guests out of review submission
          setHasReview(true);
        }

        setLoading(false);
        console.log(result);
      } catch (error) {
        console.log(
          "An error has occurred when attempting to fetch location reviews."
        );
        console.error(error);
        setLoading(false);
      }
    };

    fetchLocationReviews();
  }, [location_id]);

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Stack spacing={2}>
            {reviews.map((item) => (
              <ReviewComponent key={item.review_id} review={item} />
            ))}
          </Stack>
        </div>
      )}
    </div>
  );
}

export function UserReviewList({ relatedBool }) {
  // Review list for the /reviews page
  // Relatedbool will always be false, related no longer in use. Keeping the code just in case.
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchUserReviews = async () => {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (relatedBool) {
          const result = await getRelatedReviews(user.id); //Defunct
          setReviews(result);
        } else {
          const result = await GetUserReviews(user.id);
          setReviews(result);
        }
        setLoading(false);
      } catch (error) {
        console.log(
          "An error has occurred when attempting to fetch location reviews."
        );
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {relatedBool ? <h2>Users Like You:</h2> : <h2>My Reviews:</h2>}
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 && !relatedBool ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              ".dark &": {
                color: "#fff",
              },
            }}
          >
            No reviews yet, search a location to begin contributing!
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            pb: 1,
          }}
        >
          <Stack spacing={2} direction="row" sx={{ minWidth: "max-content" }}>
            {reviews?.map((item) => (
              <ReviewComponent
                key={item.review_id}
                review={item}
                location_name={item.location_name}
                relatedBool={relatedBool}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
