import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

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
      .select("*")
      .in("user_id", similarUserIds);

    if (reviewError) {
      return NextResponse.json(
        { error: "Error fetching reviews." },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
