import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {

        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');

        if ( user_id === null || user_id === ' ') {
            return NextResponse.json(
                { error: 'User must be signed in to fetch reviews.' }, 
                { status: 400 }
            )
        }

        console.log('Fetching reviews for ', user_id); 

        const {data, error} = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: "Error fetching reviews." }, { status: 400 })
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}