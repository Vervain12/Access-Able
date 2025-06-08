import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// If user already has reviewed this location they may not review again.
// This is implemented within the database as a unique constraint.
// TODO: Make this clear to users.

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

        const {data, error} = await supabase
            .from('reviews')
            .insert([body])
            .select()

        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

}
