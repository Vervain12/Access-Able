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
  
    //Fetching disability info
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

    //Fetching similar users
    const { data: similarProfiles, error: similarError } = await supabase
      .from("profiles")
      .select("id")
      .overlaps("disability_info", currentUserProfile.disability_info);

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

    //Fetching location_id's and ratings from similar user reviews (rating above 3.5 to help with load-times)
    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select("location_id, rating, created_at")
      .gt("rating", 3.5)
      .in("user_id", similarUserIds);

    if (reviewError) {
      console.error("Suggestion review fetch error: ", reviewError);
      return NextResponse.json(
        { error: "Error fetching reviews." },
        { status: 400 }
      );
    }

    //Calculating avg rating for locations and querying overpass
    const locationStats = Object.entries(
      reviews.reduce((acc, review) => {
        const { location_id, rating, created_at } = review;
        if(!acc[location_id]) {
          acc[location_id] = { count : 0, sum: 0, latestCreationTime: created_at}
        }
        acc[location_id].count += 1;
        acc[location_id].sum += rating;

        if (new Date(created_at) > new Date(acc[location_id].latestCreationTime)) {
          acc[location_id].latestCreationTime = created_at;
        }

        return acc;
      }, {})
    )
    .map(([locationId, { count, sum, latestCreationTime }]) => ({
      locationId,
      avgRating: sum / count,
      count,
      latestCreationTime,
    }))
    .filter(loc => loc.avgRating > 3.5)
    .sort((a, b) => new Date(b.latestCreationTime) - new Date(a.latestCreationTime))
    .slice(0, 10)

    console.log("locationstats: ",locationStats)

    let locationsToFetch = "";
    for (const loc of locationStats) {
      locationsToFetch += `node(${loc.locationId});\n`;
    }

    const query = `
      [out:json][timeout:25];
      (
      ${locationsToFetch}
      );
      out body;
      `;

    console.log("Suggestion query: ", query);
    
    if (locationsToFetch.length > 0) {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`,
      });
        
      const data = await response.json();

      const locationStatsMap = locationStats.reduce((acc, loc) => {
        acc[loc.locationId] = loc;
        return acc;
      }, {});

      const locationsWithRating = data.elements.map((element) => {
        const ratingInfo = locationStatsMap[element.id];
        return {
          ...element,
          rating: ratingInfo?.avgRating || null,
          count: ratingInfo?.count || 0,
        };
      });

      return NextResponse.json({ data: locationsWithRating }, { status: 200 });

    } else {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

  } catch (error){
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}