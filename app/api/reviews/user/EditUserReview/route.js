import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { textCheck } from "../../content-safety";

export async function POST(request) {
    try {
        const body = await request.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { review_id, rating, review_text } = body;

        if (!review_id || !rating || !review_text) {
            return NextResponse.json(
                { error: 'Insufficient information to update a review.' }, 
                { status: 400 }
            )
        }

        const contentResults = await textCheck({ text: review_text });
        console.log(contentResults);

        for (const category of contentResults) {
            const severity = category.severity;

            if (severity >= 1) {
                return NextResponse.json({ error: 'CONTENT_POLICY_VIOLATION', message: 'Content violates safety guidelines.' }, { status: 422 })
            }
        }

        const { data, error } = await supabase
            .from('reviews')
            .update({ 
                review_text: review_text, 
                rating: rating,
            })
            .eq('review_id', review_id)
            .eq('user_id', user.id) 
            .select();
            
        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

}
