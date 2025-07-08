import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { textCheck } from "../../../api-components/content-safety";

export async function POST(request) {
    try {
        const body = await request.json();
        const supabase = await createClient();

        const { user_id, location_id, rating, review_text } = body;

        if (!user_id || !location_id || !rating || !review_text) {
            return NextResponse.json(
                { error: 'Insufficient information to create a review.' }, 
                { status: 400 }
            )
        }

        const contentResults = await textCheck({ text: review_text });
        console.log("Text scan results: ", contentResults);

        for (const category of contentResults) {
            const severity = category.severity;

            if (severity >= 1) {
                return NextResponse.json({ error: 'CONTENT_POLICY_VIOLATION', message: 'Content violates safety guidelines.' }, { status: 422 })
            }
        }

        const {data, error} = await supabase
            .from('reviews')
            .insert([body])
            .select()

        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        if (error.code === '23505') {
            return Response.json(
                { error: 'DUPLICATE_REVIEW', message: 'You have already reviewed this location' },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

}
