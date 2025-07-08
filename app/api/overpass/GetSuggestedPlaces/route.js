/*
Step 1: Fetch user
Step 2: Get users disability info
Step 3: Find similar users (overlaps disability info - check GetRelatedReviews)
Step 4: Get similar users reviews
Step 5: Get overall rating of each location from those reviews
Step 6: 
Step : Query for all location id's 

Query example (construct using string, replace id's with the proper node id's returned by review fetch)

[out:json][timeout:25];
(
  node(480248463);
  node(11563447509);
  node(8418829868);
);
out body;
*/
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const apiUrl = "https://overpass-api.de/api/interpreter";

    if (!user_id) {
      return NextResponse.json(
        { error: "User must be signed in to fetch related reviews." },
        { status: 444 }
      );
    }
  
    const { data: currentUserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("disability_info")
      .eq("id", user_id)
      .single();

    if (profileError || !currentUserProfile?.disability_info) {
      return NextResponse.json(
        { error: "Unable to fetch profile or disability info." },
        { status: 423 }
      );
    }

    const { data: similarProfiles, error: similarError } = await supabase
      .from("profiles")
      .select("id")
      .overlaps("disability_info", currentUserProfile.disability_info)
      .neq("id", user_id);

    if (similarError) {
      return NextResponse.json(
        { error: "Unable to find similar profiles." },
        { status: 401 }
      );
    }

    const similarUserIds = similarProfiles.map((p) => p.id);
    console.log("Related users fetched: ", similarUserIds);

    if (similarUserIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select("location_id, rating")
      .in("user_id", similarUserIds);

    if (reviewError) {
      return NextResponse.json(
        { error: "Error fetching reviews." },
        { status: 400 }
      );
    }

    const ratingMap = new Map();
    if (reviews && reviews.length > 0) {
        const groupedRatings = reviews.reduce((acc, review) => {
            if (!acc[review.location_id]) {
                acc[review.location_id] = [];
            }
            acc[review.location_id].push(review.rating);
            return acc;
        }, {});
        
        Object.entries(groupedRatings).forEach(([locationId, ratings]) => {
            const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            ratingMap.set(locationId, avg);
        });
    }

    let locationsToFetch = "";
    ratingMap.forEach((averageRating, locationId) => {
      if (averageRating > 3.5) {
        locationsToFetch += `node(${locationId});\n`
      }
    });

    const query = `
      [out:json][timeout:25];
      (
      ${locationsToFetch}
      );
      out body;
      `;

    console.log(query);
    
    if (locationsToFetch.length > 0) {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`,
      });
        
      const data = await response.json();
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

  } catch (error){
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}