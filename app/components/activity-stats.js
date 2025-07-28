import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useActivityStats() {
  const [stats, setStats] = useState({
    reviewsWritten: 0,
    placesVisited: 0,
    savedPlaces: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/reviews/user/GetReviewCount?user_id=${user.id}`);
      const reviewData = await res.json();

      const reviewsWritten = reviewData?.count || 0;

      const { data: reviewLocations, error: reviewError } = await supabase
        .from("reviews")
        .select("location_id")
        .eq("user_id", user.id);

      const placesVisited =
        reviewError || !reviewLocations
          ? 0
          : new Set(reviewLocations.map((r) => r.location_id)).size;

      const { data: saved, error: savedError } = await supabase
        .from("saved_locations")
        .select("location_id")
        .eq("user_id", user.id);

      const savedPlaces = savedError || !saved ? 0 : saved.length;

      setStats({
        reviewsWritten,
        placesVisited,
        savedPlaces,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
