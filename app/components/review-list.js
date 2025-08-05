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
  Button
} from "@mui/material";
import { ReviewComponent } from "./review-component";
import { createClient } from "@/utils/supabase/client";

export function ReviewList({ location_id, setHasReview }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchLocationReviews = async () => {
      try {
        const result = await GetLocationReviews(location_id);
        setReviews(result);

        // Checking if the user has a review already
        const supabase = createClient();
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
  }, [location_id, setHasReview]);

  const handleLoadAll = () => {
    setLoadAll(true);
  }

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <div className="flex flex-row pb-4">
            <p className="text-bold text-lg mr-108">Recent Reviews</p>
            <Button
              variant="contained"
              sx={{
                width: "200px",
                height: "30px",
                color: "white",
              }}
              onClick={() => handleLoadAll()}
            >
              View All Reviews
            </Button>
          </div>
          <Stack spacing={3} sx={{ alignItems: "center", width: "100%" }}>
            {(loadAll ? reviews : reviews.slice(0, 5)).map((item) => (
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
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUserReviews = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          if (relatedBool) {
            const result = await getRelatedReviews(user.id); //Defunct
            setReviews(result);
          } else {
            const result = await GetUserReviews(user.id);
            setReviews(result);
          }
        } else {
          setReviews([]);
        }
        setLoading(false);
      } catch (error) {
        console.log(
          "An error has occurred when attempting to fetch user/related reviews."
        );
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [relatedBool]);

  const handleLoadAll = () => {
    setLoadAll(true);
  }

  return (
    <Box sx={{ p: 2 }}>
      {relatedBool ? <h2>Users Like You:</h2> : <h2 className="font-bold pb-4 text-xl">My Reviews:</h2>}
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 && !relatedBool ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography variant="body1" color="text.secondary">
            No reviews yet, search a location to begin contributing!
          </Typography>
        </Box>
      ) : (
        <Box>
          <Stack
            spacing={3}
            direction="column"
            sx={{ alignItems: "center", width: "100%" }}
          >
            {(loadAll ? reviews : reviews.slice(0, 5))?.map((item) => (
              <ReviewComponent
                key={item.review_id}
                review={item}
                location_name={item.location_name}
                relatedBool={relatedBool}
              />
            ))}
          </Stack>
          {reviews.length > 5 && !loadAll && (
            <div className="flex justify-center pt-4">
              <Button
                variant="contained"
                sx={{
                  width: "200px",
                  height: "30px",
                  color: "white",
                }}
                onClick={() => handleLoadAll()}
              >
                View All Reviews
              </Button>
            </div>
          )}
        </Box>
      )}
    </Box>
  );
}