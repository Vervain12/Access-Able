import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request) {
  try { 
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const location_id = searchParams.get("location_id");

    if (!location_id) {
        return NextResponse.json(
            { error: 'No location id given.' }, 
            { status: 400 }
        );
    }

    if (!user) {
        console.log("User must be signed in to view location summaries.");
        return NextResponse.json({data: "You must be signed in to view location summaries."}, { status: 401 });
    }

    // If there is a recent (six hour) preexisting summary, that is returned instead
    const { data: existingSummary, error: summaryFetchError } = await supabase
    .from("summaries")
    .select("text, created_at")
    .eq("location_id", location_id)
    .order("created_at", { ascending: false })
    .limit(1);

    if (summaryFetchError) {
        console.error('Error fetching latest summary :', summaryFetchError);
        return NextResponse.json(
            { error: 'Failed to fetch summary' },
            { status: 500 }
        );
    }

    if (existingSummary?.[0] && Date.now() - new Date(existingSummary[0].created_at).getTime() < 6 * 60 * 60 * 1000) {
        console.log("Existing summary fetched:", existingSummary[0].text);
        return NextResponse.json({ data: existingSummary[0].text }, { status: 200 });
    }

    console.log('Fetching latest twenty reviews for ', location_id, " summary"); 

    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('location_id', location_id)
        .order('created_at', {ascending: false})
        .limit(20);

    if (reviewsError) {
      console.error('Error fetching summary reviews:', reviewsError);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    if (reviews?.length === 0 || !reviews) {
        console.log("This location has no reviews.");
        return NextResponse.json({data: 'No reviews or preexisting summary found.'});
    }

    const reviewTexts = reviews.map((r, i) => `Review ${i + 1}: ${r.review_text} Rating: ${r.rating}`).join("\n");

    const prompt = `You are an assistant that summarizes user reviews with a focus on accessibility insights.
                    Summarize the key points from the following reviews for this location. Focus on accessibility, 
                    positive/negative feedback, and anything of relevance for people with disabilities. \n
                    Format your response simply, with a section for positive accessibility features and a section for negatives. \n
                    Do not write "Here is a summary" or anything of that nature. Do not add asterisks.\n`

    // Fetching summary
    const client = new OpenAI();
    
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: reviewTexts }
      ],
      temperature: 0,
      max_tokens: 500,
    });

    const summary = response.choices?.[0]?.message?.content;
    
    console.log("Summary: ", summary);

    // Creating or updating an old summary
    await supabase
    .from("summaries")
    .upsert({
        location_id: location_id,
        text: summary,
        created_at: new Date().toISOString(),
    });

    return NextResponse.json({ data: summary }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}